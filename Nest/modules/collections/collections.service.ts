import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectionEntity } from '../storage/entities';
import { Repository } from 'typeorm';
import { PinataService } from '../pinata/pinata.service';
import { StorageService } from '../storage/storage.service';
import { WalletDto } from '../storage/dto/wallet.dto';
import { delay, getSystemWallet, Metadata } from '../../utils';
import { Item, Status } from '../nft/types';
import { CollectionDto } from '../storage/dto/collection.dto';
import {
  filterByMint,
  filterByOwnerId,
  filterByAuthorName,
  filterByName,
  filterByAdmin,
  filterByCategoryId,
  filterByCategoryName,
  filterByAuthorId,
  filterByOwnerName,
} from './filters/collection.filters';
import { FavoritesEntity } from '../storage/entities/favorites.entity';
import { PublicKey } from '@solana/web3.js';
import { setAndVerifyCollection } from '../blockchain/setAndVerifyCollection';
import { Connection } from '@metaplex/js';
import { mintToken } from '../blockchain/mint';
import { FavoritesDto } from '../storage/dto/favorites.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CollectionsService {
  private readonly systemWallet = getSystemWallet();
  private readonly connection = new Connection(
    this.config.get('solana.network'),
  );
  constructor(
    @InjectRepository(CollectionEntity)
    private readonly collectionRepository: Repository<CollectionEntity>,
    @InjectRepository(FavoritesEntity)
    private readonly favoritesRepository: Repository<FavoritesEntity>,
    private readonly pinataService: PinataService,
    private readonly config: ConfigService,
    private readonly storageService: StorageService,
  ) {}

  async create(files, payload) {
    if (!files || !files['image']) {
      throw new HttpException('Image must be provided.', 400);
    }
    let author;
    if (!payload.fromAdmin) {
      author = await this.storageService.getProfileById(payload.author);
      if (!author) {
        throw new HttpException('Author does not exists.', 400);
      }
    } else {
      author = await this.storageService.getProfile(
        new WalletDto({
          address: this.systemWallet.publicKey.toString(),
          connectedWallet: 'Phantom',
        }),
      );
    }
    const fieldsNames = ['logo', 'banner'];
    for (const fieldName of fieldsNames) {
      if (files[fieldName]) {
        payload[fieldName] = await this.pinataService.pinFile(
          files[fieldName][0],
        );
      }
    }
    const metadata = new Metadata(JSON.parse(payload.metadata));
    const { name } = metadata;
    payload.name = name;
    metadata.image = await this.pinataService.pinFile(files['image'][0]);
    metadata.properties.creators = payload.fromAdmin
      ? [{ address: author?.wallet.address, share: 100 }]
      : [
          { address: this.systemWallet.publicKey.toString(), share: 2.5 },
          { address: author?.wallet.address, share: 97.5 },
        ];
    payload.metadata = metadata;
    payload.metadataAddress = await this.pinataService.pinJSON(
      payload.metadata,
    );
    payload.author = author;
    payload.owner = author;
    if (payload.category) {
      const category = await this.storageService.getCategory(payload.category);
      if (!category) {
        throw new HttpException(
          `Category #${payload.category} does not exist.`,
          400,
        );
      }
      payload.category = category;
    }
    payload.status = Status.Created;
    return await this.collectionRepository.save(new CollectionDto(payload));
  }

  async update(files, payload, parse = true) {
    const existedCollection = await this.findOne(payload.id);
    if (payload.metadata) {
      const existedMetadata = existedCollection.metadata;
      let payloadMetadata;
      if (parse) {
        payloadMetadata = JSON.parse(payload.metadata);
      } else {
        payloadMetadata = payload.metadata;
      }
      if (payloadMetadata.hasOwnProperty('name')) {
        const { name } = payloadMetadata;
        payload.name = name;
      }
      for (const field of Object.keys(payloadMetadata)) {
        existedMetadata[field] = payloadMetadata[field];
      }
      if (files && files['image']) {
        existedMetadata.image = await this.pinataService.pinFile(
          files['image'][0],
        );
      }
      payload.metadata = existedMetadata;
      payload.metadataAddress = await this.pinataService.pinJSON(
        payload.metadata,
      );
    }
    const fieldsNames = ['logo', 'banner'];
    for (const fieldName of fieldsNames) {
      if (files && files[fieldName]) {
        payload[fieldName] = await this.pinataService.pinFile(
          files[fieldName][0],
        );
      }
    }
    payload.updatedAt = new Date();
    const collection = new CollectionDto(payload);
    await this.collectionRepository.update(collection.id, collection);
    return await this.findOne(collection.id);
  }

  async delete(id: number) {
    const collection = await this.findOne(id);
    if (!collection) {
      throw new HttpException(`Collection #${id} does not exist.`, 400);
    }
    const collectionItems = collection.items;
    collectionItems?.map(async (item) => {
      item.collection = null;
      await this.storageService.updateItem(item);
    });
    collection.deleted = Item.Deleted;
    collection.deletedAt = new Date();
    const { items, ...result } = collection;
    await this.collectionRepository.update(id, result);
    return await this.getDeleted(id);
  }

  async find(query) {
    const take = parseInt(query?.take) || 20;
    const page = parseInt(query?.page) || 1;
    const skip = take * (page - 1);
    let collectionQuery = await this.collectionRepository
      .createQueryBuilder('collection')
      .leftJoinAndSelect('collection.author', 'author')
      .leftJoinAndSelect('collection.owner', 'owner')
      .leftJoinAndSelect('author.wallet', 'wallet')
      .leftJoinAndSelect('collection.category', 'category')
      .leftJoinAndSelect('collection.items', 'items')
      .andWhere('collection.deleted = :deleted', { deleted: Item.NotDeleted });
    if (query) {
      collectionQuery = await filterByName(collectionQuery, query);
      collectionQuery = await filterByMint(collectionQuery, query);
      collectionQuery = await filterByAuthorName(collectionQuery, query);
      collectionQuery = await filterByOwnerName(collectionQuery, query);
      collectionQuery = await filterByAuthorId(collectionQuery, query);
      collectionQuery = await filterByOwnerId(collectionQuery, query);
      collectionQuery = await filterByAdmin(collectionQuery, query);
      collectionQuery = await filterByCategoryId(collectionQuery, query);
      collectionQuery = await filterByCategoryName(collectionQuery, query);
    }
    const total = await collectionQuery.getCount();
    collectionQuery.take(take);
    collectionQuery.skip(skip);
    collectionQuery.orderBy('collection.id', 'DESC');
    let collections = await collectionQuery.getMany();
    const favorites = await this.favoritesRepository
      .createQueryBuilder('fav')
      .select('fav.collection_id')
      .addSelect('COUNT(fav.user_id)::int', 'likes')
      .groupBy('fav.collection_id')
      .getRawMany();
    collections = collections?.map((collection) => {
      const index = favorites.findIndex(
        (favorite) => favorite.collection_id === collection.id,
      );
      let likes = 0;
      if (index !== -1) likes = favorites[index].likes;
      return {
        ...collection,
        likes,
      };
    });
    return {
      collections,
      total,
      take,
      page,
    };
  }

  async findOneWithRelations(id: number) {
    const collectionQuery = await this.collectionRepository.createQueryBuilder(
      'collection',
    );
    collectionQuery.leftJoinAndSelect('collection.author', 'author');
    collectionQuery.leftJoinAndSelect('author.wallet', 'wallet');
    collectionQuery.leftJoinAndSelect('collection.owner', 'owner');
    collectionQuery.leftJoinAndSelect('collection.category', 'category');
    collectionQuery.leftJoinAndSelect('collection.items', 'items');
    collectionQuery.where('collection.id = :id', { id });
    collectionQuery.andWhere('collection.deleted = :isDeleted', {
      isDeleted: Item.NotDeleted,
    });
    const collection = await collectionQuery.getOne();
    if (!collection) {
      throw new HttpException(`Collection #${id} does not exist.`, 400);
    }
    const favorites = await this.favoritesRepository
      .createQueryBuilder('fav')
      .select('fav.collection_id')
      .addSelect('COUNT(fav.user_id)::int', 'likes')
      .groupBy('fav.collection_id')
      .getRawMany();
    const index = favorites.findIndex(
      (favorite) => favorite.collection_id === collection?.id,
    );
    let likes = 0;
    if (index !== -1) likes = favorites[index]?.likes;
    return {
      ...collection,
      likes,
    };
  }

  async findOne(id: number) {
    return await this.collectionRepository.findOne({
      where: { id, deleted: Item.NotDeleted },
      relations: ['items'],
    });
  }

  async getMinted() {
    const collectionQuery = await this.collectionRepository.createQueryBuilder(
      'collection',
    );
    collectionQuery.leftJoinAndSelect('collection.owner', 'owner');
    collectionQuery.leftJoinAndSelect('owner.wallet', 'wallet');
    collectionQuery.andWhere('collection.mintAddress IS NOT NULL');
    return await collectionQuery.getMany();
  }

  async getDeleted(id: number) {
    return await this.collectionRepository.findOne(id);
  }

  async add(payload) {
    const collection = await this.findOne(payload.collectionId);
    if (!collection) {
      throw new HttpException(
        `Collection #${payload.collectionId} does not exist.`,
        400,
      );
    }
    const item = await this.storageService.getItem(payload.itemId, false);
    if (!item) {
      throw new HttpException(`Item #${payload.itemId} does not exist.`, 400);
    }
    if (!item.mintAddress) {
      throw new HttpException(`At first you need to mint the item.`, 400);
    }
    if (!collection.mintAddress) {
      throw new HttpException(`At first you need to mint the collection`, 400);
    }
    const mintKey = new PublicKey(item.mintAddress);
    const collectionMint = new PublicKey(collection.mintAddress);
    return await setAndVerifyCollection(
      mintKey,
      this.connection,
      this.systemWallet,
      collectionMint,
    );
  }

  async verify(payload) {
    if (
      !payload.hasOwnProperty('id') ||
      !payload.hasOwnProperty('isVerified')
    ) {
      throw new HttpException('Invalid params', 400);
    }
    const collection = await this.findOne(payload.id);
    if (!collection) {
      throw new HttpException(`Collection ${payload.id} does not exist.`, 400);
    }
    collection.isVerified = payload.isVerified;
    return await this.collectionRepository.save(collection);
  }

  async block(payload) {
    if (!payload.hasOwnProperty('id') || !payload.hasOwnProperty('isBlocked')) {
      throw new HttpException('Invalid params', 400);
    }
    const collection = await this.findOne(payload.id);
    if (!collection) {
      throw new HttpException(`Collection ${payload.id} does not exist.`, 400);
    }
    collection.isBlocked = payload.isBlocked;
    return await this.collectionRepository.save(collection);
  }

  async mint(id) {
    let collection = await this.findOne(id);
    if (!collection) {
      throw new HttpException(`Collection ${id} does not exists`, 400);
    }
    if (!collection.metadataAddress) {
      const metadataAddress = await this.pinataService.pinJSON(
        collection.metadata,
      );
      await this.update(
        null,
        new CollectionDto({ id: collection.id, metadataAddress }),
      );
      collection = await this.findOne(id);
      await delay(15000);
    }
    if (
      collection.metadataAddress &&
      collection.metadataAddress.includes('https://ipfs.io')
    ) {
      const metadataAddress = collection.metadataAddress.replace(
        'https://ipfs.io',
        'https://nftrealworld.mypinata.cloud',
      );
      await this.update(
        null,
        new CollectionDto({ id: collection.id, metadataAddress }),
      );
      collection = await this.findOne(id);
    }
    const metadataUri = collection.metadataAddress;
    const { mint } =
      (await mintToken(
        this.connection,
        this.systemWallet,
        metadataUri,
        true,
        null,
        collection.maxSupply,
        true,
        null,
        null,
      )) || {};
    if (!mint) {
      throw new HttpException(
        'The IFPS data has not been processed yet. Try again.',
        504,
      );
    }
    collection.mintAddress = mint.toString();
    collection.status = Status.Minted;
    const updateCollection = new CollectionDto({
      id: collection.id,
      mintAddress: collection.mintAddress,
      status: Status.Minted,
    });
    await this.update(null, updateCollection, false);
    return collection;
  }

  async addToFavorites(collectionId: number, userId: number) {
    const collection = await this.findOne(collectionId);
    if (!collection) {
      throw new HttpException(
        `Collection #${collectionId} does not exist.`,
        400,
      );
    }
    const favoriteCollection = new FavoritesDto({ collectionId, userId });
    return await this.favoritesRepository.save(favoriteCollection);
  }

  async removeFromFavorites(collectionId: number, userId: number) {
    const favoriteCollection = await this.getFavoriteCollection(
      collectionId,
      userId,
    );
    if (!favoriteCollection) {
      throw new HttpException(`Favorite collection does not exists.`, 400);
    }
    return await this.favoritesRepository.delete(favoriteCollection.id);
  }

  async getFavoriteCollection(collectionId, userId) {
    return await this.favoritesRepository.findOne({
      where: { collectionId, userId },
    });
  }

  async getFavorites(userId) {
    const favorites = await this.storageService.getFavorites(userId);
    const collectionsIds = favorites.map((favorite) => favorite.collectionId);
    let collections = [];
    if (collectionsIds && collectionsIds.length > 0) {
      collections = await this.getCollectionsByIds(collectionsIds);
    }
    return { collections };
  }

  async getCollectionsByIds(ids) {
    const collectionQuery = await this.collectionRepository.createQueryBuilder(
      'collection',
    );
    collectionQuery.leftJoinAndSelect('collection.author', 'author');
    collectionQuery.leftJoinAndSelect('collection.owner', 'owner');
    collectionQuery.leftJoinAndSelect('author.wallet', 'wallet');
    collectionQuery.where('collection.id IN (:...ids)', { ids });
    collectionQuery.andWhere('collection.deleted = :deleted', {
      deleted: Item.NotDeleted,
    });
    collectionQuery.andWhere('collection.isBlocked = :isBlocked', {
      isBlocked: false,
    });
    collectionQuery.orderBy('collection.id', 'DESC');
    return await collectionQuery.getMany();
  }
}

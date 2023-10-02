import { SelectQueryBuilder } from 'typeorm';
import { CollectionEntity } from '../../storage/entities';

export async function filterByName(
  query: SelectQueryBuilder<CollectionEntity>,
  { name },
) {
  if (!name) return query;
  query.andWhere('LOWER(collection.name) LIKE :name', {
    name: `%${name.toLowerCase()}%`,
  });
  return query;
}

export async function filterByMint(
  query: SelectQueryBuilder<CollectionEntity>,
  { mint },
) {
  if (!mint) return query;
  query.andWhere('LOWER(collection.mintAddress) LIKE :mint', {
    mint: `%${mint.toLowerCase()}%`,
  });
  return query;
}

export async function filterByOwnerId(
  query: SelectQueryBuilder<CollectionEntity>,
  { ownerId },
) {
  if (!ownerId) return query;
  query.andWhere('owner.id = :ownerId', { ownerId });
  return query;
}

export async function filterByAuthorId(
  query: SelectQueryBuilder<CollectionEntity>,
  { authorId },
) {
  if (!authorId) return query;
  query.andWhere('author.id = :authorId', { authorId });
  return query;
}

export async function filterByAuthorName(
  query: SelectQueryBuilder<CollectionEntity>,
  { author },
) {
  if (!author) return query;
  query.andWhere('LOWER(author.username) LIKE :author', {
    author: `%${author.toLowerCase()}%`,
  });
  return query;
}

export async function filterByOwnerName(
  query: SelectQueryBuilder<CollectionEntity>,
  { owner },
) {
  if (!owner) return query;
  query.andWhere('LOWER(owner.username) LIKE :owner', {
    author: `%${owner.toLowerCase()}%`,
  });
  return query;
}

export async function filterByAdmin(
  query: SelectQueryBuilder<CollectionEntity>,
  { fromAdmin },
) {
  if (!fromAdmin) return query;
  query.andWhere('collection.fromAdmin = :fromAdmin', { fromAdmin });
  return query;
}

export async function filterByCategoryId(
  query: SelectQueryBuilder<CollectionEntity>,
  { categoryId },
) {
  if (!categoryId) return query;
  query.andWhere('category.id = :categoryId', { categoryId });
  return query;
}

export async function filterByCategoryName(
  query: SelectQueryBuilder<CollectionEntity>,
  { category },
) {
  if (!category) return query;
  query.andWhere('LOWER(category.name) LIKE :category', {
    category: `%${category.toLowerCase()}%`,
  });
  return query;
}

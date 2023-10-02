import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionEntity } from '../storage/entities';
import { PinataModule } from '../pinata/pinata.module';
import { StorageModule } from '../storage/storage.module';
import { CacheManagerModule } from '../cache-manager/cache-manager.module';
import { AccountModule } from '../account/account.module';
import { FavoritesEntity } from '../storage/entities/favorites.entity';

@Module({
  imports: [
    PinataModule,
    StorageModule,
    CacheManagerModule,
    AccountModule,
    TypeOrmModule.forFeature([CollectionEntity, FavoritesEntity]),
  ],
  providers: [CollectionsService],
  exports: [CollectionsService],
  controllers: [CollectionsController],
})
export class CollectionsModule {}

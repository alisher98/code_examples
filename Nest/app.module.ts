import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import config from './modules/configuration/index';
import { StorageModule } from './modules/storage/storage.module';
import { WebsocketModule } from './websocket/websocket.module';
import { NftModule } from './modules/nft/nft.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AccountModule } from './modules/account/account.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { PinataModule } from './modules/pinata/pinata.module';
import { CollectionsModule } from './modules/collections/collections.module';
import { LoggerMiddleware } from './utils';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './modules/cron/cron.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    CronModule,
    StorageModule,
    WebsocketModule,
    NftModule,
    AccountModule,
    MailerModule,
    AdminModule,
    AuthModule,
    PinataModule,
    CollectionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [StorageModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

// test/app.e2e-spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortUrl } from '../src/short-url/entities/short-url.entity';
import { Click } from '../src/analytics/entities/click.entity';

describe('ShortUrlController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [ShortUrl, Click],
          synchronize: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 10000); // увеличим таймаут на инициализацию

  it('should create a short URL with a custom alias', async () => {
    const res = await request(app.getHttpServer())
      .post('/shorten')
      .send({
        originalUrl: 'https://google.com',
        alias: 'mytestalias',
      })
      .expect(201);

    expect(res.body.shortUrl).toContain('/mytestalias');
  });

  it('should redirect to original URL', async () => {
    await request(app.getHttpServer()).post('/shorten').send({
      originalUrl: 'https://example.com',
      alias: 'redirtest',
    });

    const res = await request(app.getHttpServer())
      .get('/redirtest')
      .expect(302);

    expect(res.headers.location).toBe('https://example.com');
  });

  afterAll(async () => {
    await app.close();
  });
});

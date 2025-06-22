import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShortUrl } from './entities/short-url.entity';
import { CreateShortUrlDto } from './dto/create-short-url.dto';
import { v4 as uuidv4 } from 'uuid';
import { AnalyticsService } from '../analytics/analytics.service';
import { Request } from 'express';

@Injectable()
export class ShortUrlService {
  constructor(
    @InjectRepository(ShortUrl)
    private shortUrlRepository: Repository<ShortUrl>,
    private readonly analyticsService: AnalyticsService,
  ) {}

  private generateAlias(): string {
    return uuidv4().slice(0, 8); // короткий UUID
  }

  async create(createDto: CreateShortUrlDto): Promise<ShortUrl> {
    const alias = createDto.alias || this.generateAlias();

    const exists = await this.shortUrlRepository.findOne({ where: { alias } });
    if (exists) {
      throw new ConflictException('Alias already exists');
    }

    const shortUrl = this.shortUrlRepository.create({
      ...createDto,
      alias,
    });

    return this.shortUrlRepository.save(shortUrl);
  }

  async getInfo(alias: string): Promise<ShortUrl> {
    const shortUrl = await this.shortUrlRepository.findOne({
      where: { alias },
    });
    if (!shortUrl) throw new NotFoundException('Short URL not found');
    return shortUrl;
  }

  async redirect(alias: string, req: Request): Promise<string> {
    const shortUrl = await this.shortUrlRepository.findOne({
      where: { alias },
    });
    if (!shortUrl) throw new NotFoundException('Short URL not found');

    if (shortUrl.expiresAt && shortUrl.expiresAt < new Date()) {
      throw new NotFoundException('Short URL has expired');
    }

    shortUrl.clickCount += 1;
    await this.shortUrlRepository.save(shortUrl);

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    await this.analyticsService.logClick(String(ip), shortUrl);

    return shortUrl.originalUrl;
  }

  async delete(alias: string): Promise<void> {
    const result = await this.shortUrlRepository.delete({ alias });
    if (result.affected === 0) {
      throw new NotFoundException('Short URL not found');
    }
  }
}

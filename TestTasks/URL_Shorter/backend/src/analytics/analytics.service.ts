import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Click } from './entities/click.entity';
import { ShortUrl } from '../short-url/entities/short-url.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Click)
    private clickRepository: Repository<Click>,
    @InjectRepository(ShortUrl)
    private shortUrlRepository: Repository<ShortUrl>,
  ) {}

  async logClick(ip: string, shortUrl: ShortUrl): Promise<void> {
    const click = this.clickRepository.create({
      ip,
      shortUrl,
    });
    await this.clickRepository.save(click);
  }

  async getAnalytics(alias: string) {
    const shortUrl = await this.shortUrlRepository.findOne({
      where: { alias },
      relations: ['clicks'],
    });

    if (!shortUrl) return null;

    const recentClicks = await this.clickRepository.find({
      where: { shortUrl: { id: shortUrl.id } },
      order: { clickedAt: 'DESC' },
      take: 5,
    });

    return {
      totalClicks: shortUrl.clickCount,
      lastFiveIps: recentClicks.map((c) => c.ip),
    };
  }
}
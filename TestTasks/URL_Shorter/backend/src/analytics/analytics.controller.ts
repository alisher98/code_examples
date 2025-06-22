import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get(':alias')
  async get(@Param('alias') alias: string) {
    const data = await this.analyticsService.getAnalytics(alias);
    if (!data) throw new NotFoundException('Short URL not found');
    return data;
  }
}

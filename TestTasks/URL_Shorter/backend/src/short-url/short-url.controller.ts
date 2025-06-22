import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import { ShortUrlService } from './short-url.service';
import { CreateShortUrlDto } from './dto/create-short-url.dto';
import { Response, Request } from 'express';

@Controller()
export class ShortUrlController {
  constructor(private readonly shortUrlService: ShortUrlService) {}

  @Post('shorten')
  async create(@Body() dto: CreateShortUrlDto) {
    const short = await this.shortUrlService.create(dto);
    return {
      shortUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/${short.alias}`,
    };
  }

  @Get(':alias')
  async redirect(
    @Param('alias') alias: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const url = await this.shortUrlService.redirect(alias, req);
    res.redirect(url);
  }

  @Get('info/:alias')
  async info(@Param('alias') alias: string) {
    const data = await this.shortUrlService.getInfo(alias);
    return {
      originalUrl: data.originalUrl,
      createdAt: data.createdAt,
      clickCount: data.clickCount,
    };
  }

  @Delete('delete/:alias')
  async remove(@Param('alias') alias: string) {
    await this.shortUrlService.delete(alias);
    return { message: 'Deleted successfully' };
  }
}

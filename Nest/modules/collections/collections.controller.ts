import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { UserGuard } from '../../guards/user.guard';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { GetCollectionsDto } from './query-dto/get-collections.dto';

@ApiTags('collection')
@Controller('collection')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get()
  async find(@Query() query: GetCollectionsDto) {
    return await this.collectionsService.find(query);
  }

  @Post('create')
  @UseGuards(UserGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
        logo: {
          type: 'string',
          format: 'binary',
        },
        banner: {
          type: 'string',
          format: 'binary',
        },
        currentPrice: {
          type: 'string',
        },
        category: {
          type: 'number',
          description: 'id of category',
        },
        metadata: {
          type: 'json',
          description: '{ name: string, symbol: string, description: string }',
        },
        levels: {
          type: 'json',
        },
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'logo', maxCount: 1 },
      { name: 'banner', maxCount: 1 },
    ]),
  )
  async create(
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      logo?: Express.Multer.File[];
      banner?: Express.Multer.File[];
    },
    @Body() payload,
    @Req() req,
  ) {
    payload.maxSupply = 0;
    payload.author = req.user.id;
    return await this.collectionsService.create(files, payload);
  }

  @Post('add')
  @UseGuards(UserGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        collectionId: {
          type: 'number',
          description: 'Minted collection id',
        },
        itemId: {
          type: 'number',
          description: 'Minted item id',
        },
      },
    },
  })
  async add(@Body() payload) {
    return await this.collectionsService.add(payload);
  }

  @Post('mint/:id')
  @UseGuards(UserGuard)
  async mintCollection(@Param('id') id: number) {
    return await this.collectionsService.mint(id);
  }

  @Put('update/:id')
  @UseGuards(UserGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
        banner: {
          type: 'string',
          format: 'binary',
        },
        logo: {
          type: 'string',
          format: 'binary',
        },
        currentPrice: {
          type: 'string',
        },
        metadata: {
          type: 'json',
          description: '{ name: string, symbol: string }',
        },
        status: {
          type: 'number',
        },
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'logo', maxCount: 1 },
      { name: 'banner', maxCount: 1 },
    ]),
  )
  async updateCollection(
    @Param('id') id: number,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      logo?: Express.Multer.File[];
      banner?: Express.Multer.File[];
    },
    @Body() payload,
  ) {
    payload.id = id;
    return await this.collectionsService.update(files, payload);
  }

  @Delete('delete/:id')
  @UseGuards(UserGuard)
  async delete(@Param('id') id: number) {
    return await this.collectionsService.delete(id);
  }

  @Get('favorites')
  async getFavorites(@Query('userId') userId: number) {
    return await this.collectionsService.getFavorites(userId);
  }

  @Post('addToFavorites/:id')
  @UseGuards(UserGuard)
  async addToFavorites(@Param('id') id: number, @Req() req) {
    return await this.collectionsService.addToFavorites(id, req.user.id);
  }

  @Delete('removeFromFavorites/:id')
  @UseGuards(UserGuard)
  async removeFromFavorites(@Param('id') id: number, @Req() req) {
    return await this.collectionsService.removeFromFavorites(id, req.user.id);
  }

  @Get('/:id')
  async findOne(@Query() query, @Param('id') id: number) {
    return await this.collectionsService.findOneWithRelations(id);
  }
}

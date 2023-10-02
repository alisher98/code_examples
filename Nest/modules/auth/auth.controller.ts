import {
  Controller,
  Req,
  Post,
  UseGuards,
  Get,
  Body,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../../guards/local.guard';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { AdminService } from '../admin/admin.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { SearchUserDto } from '../storage/dto/search-user.dto';
import { SearchItemDto } from '../storage/dto/search-item.dto';
import { SearchItemCollectionDto } from '../storage/dto/search-item-collection.dto';
import { GlobalSearchDto } from '../storage/dto/global-search.dto';
import { CollectionsService } from '../collections/collections.service';
import { GetCollectionsDto } from '../collections/query-dto/get-collections.dto';

@Controller('admin')
@ApiTags('admin')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly collectionService: CollectionsService,
    private readonly adminService: AdminService,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
      },
    },
  })
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  async getProfile(@Req() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('collection/block/:id')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        isBlocked: {
          type: 'boolean',
          description: 'true - blocked, false - not blocked',
        },
        cause: {
          type: 'string',
          description: 'reason for blocking',
        },
      },
    },
  })
  async blockCollection(@Body() payload, @Param('id') id: number) {
    payload.id = id;
    return await this.collectionService.block(payload);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('item/block/:id')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        isBlocked: {
          type: 'boolean',
          description: 'true - blocked, false - not blocked',
        },
        cause: {
          type: 'string',
          description: 'reason for blocking',
        },
      },
    },
  })
  async blockItem(@Body() payload, @Param('id') id: number) {
    payload.id = id;
    return await this.adminService.blockItem(payload);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('users')
  async getUsers(@Query() query: SearchUserDto) {
    return await this.adminService.getUsers(query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('search')
  async search(@Query() query: GlobalSearchDto) {
    return await this.adminService.search(query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('user/verify')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'user id',
        },
        verified: {
          type: 'boolean',
          description: 'true - verified, false - not verified',
        },
      },
    },
  })
  async verify(@Body() payload) {
    return await this.adminService.verify(payload);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('user/block')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'user id',
        },
        isBlocked: {
          type: 'boolean',
        },
        cause: {
          type: 'string',
          description: 'reason for blocking',
        },
      },
    },
  })
  async block(@Body() payload) {
    return await this.adminService.block(payload);
  }

  @Get('collections')
  @UseGuards(JwtAuthGuard)
  async getCollections(@Query() query: GetCollectionsDto) {
    return await this.collectionService.find(query);
  }

  @Post('collection/add')
  @UseGuards(JwtAuthGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        collectionId: {
          type: 'number',
        },
        itemId: {
          type: 'number',
        },
      },
    },
  })
  async addItemToCollection(@Body() payload) {
    return await this.collectionService.add(payload);
  }

  @Delete('item/:id')
  @UseGuards(JwtAuthGuard)
  async deleteItem(@Param('id') id: number) {
    return await this.adminService.deleteItem(id);
  }

  @Delete('collection/:id')
  @UseGuards(JwtAuthGuard)
  async deleteCollection(@Param('id') id: number) {
    return await this.collectionService.delete(id);
  }

  @Get('itemsWithPromo')
  @UseGuards(JwtAuthGuard)
  async getItemsWithPromo(@Query() query: SearchItemDto) {
    return await this.adminService.getItemsWithPromo(query);
  }

  @Put('collection/update/:id')
  @UseGuards(JwtAuthGuard)
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
        maxSupply: {
          type: 'number',
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
    return await this.collectionService.update(files, payload);
  }

  @Put('item/update/:id')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        currentPrice: {
          type: 'string',
        },
        collection: {
          type: 'number',
        },
        category: {
          type: 'number',
        },
        metadata: {
          type: 'json',
          description: '{ name: string, symbol: string }',
        },
        status: {
          type: 'number',
        },
        promoData: {
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async updateItem(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() payload,
  ) {
    payload.id = id;
    return await this.adminService.update(file, payload);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('collection/verify/:id')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        isVerified: {
          type: 'boolean',
          description: 'true - verified, false - not verified',
        },
      },
    },
  })
  async verifyCollection(@Body() payload, @Param('id') id: number) {
    payload.id = id;
    return await this.collectionService.verify(payload);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('item/verify/:id')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        isVerified: {
          type: 'boolean',
          description: 'true - verified, false - not verified',
        },
      },
    },
  })
  async verifyItem(@Body() payload, @Param('id') id: number) {
    payload.id = id;
    return await this.adminService.verifyItem(payload);
  }

  @Post('collection/create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
        category: {
          type: 'number',
          description: 'id of category',
        },
        metadata: {
          type: 'json',
          description: '{ name: string, symbol: string, description: string }',
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
  async createCollection(
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      logo?: Express.Multer.File[];
      banner?: Express.Multer.File[];
    },
    @Body() payload,
  ) {
    const { name } = JSON.parse(payload.metadata);
    payload.maxSupply = 0;
    payload.name = name;
    payload.fromAdmin = true;
    return await this.collectionService.create(files, payload);
  }

  @Post('item/create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        collection: {
          type: 'number',
          description: 'id of collection',
        },
        currentPrice: {
          type: 'string',
        },
        metadata: {
          type: 'json',
          description: '{ name: string, symbol: string }',
        },
        category: {
          type: 'number',
          description: 'id of category',
        },
        maxSupply: {
          type: 'number',
        },
        levels: {
          type: 'json',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File, @Body() payload) {
    const { name } = JSON.parse(payload.metadata);
    payload.name = name;
    payload.fromAdmin = true;
    return await this.adminService.createItem(file, payload);
  }

  @Get('items')
  @UseGuards(JwtAuthGuard)
  async getItems(@Query() query: SearchItemCollectionDto) {
    return await this.adminService.getItems(query);
  }

  @Post('item/mint/:id')
  @UseGuards(JwtAuthGuard)
  async mintItem(@Param('id') id: number) {
    return await this.adminService.mintItem(id);
  }

  @Post('collection/mint/withItems/:id')
  @UseGuards(JwtAuthGuard)
  async mintCollectionWithItems(@Param('id') id: number) {
    return await this.adminService.minCollectionWithItems(id);
  }

  @Post('collection/mint/:id')
  @UseGuards(JwtAuthGuard)
  async mintCollection(@Param('id') id: number) {
    return await this.collectionService.mint(id);
  }

  @Get('items/fromAdmin')
  @UseGuards(JwtAuthGuard)
  async getAdminItems(@Query() query: SearchItemCollectionDto) {
    return await this.adminService.getAdminItems(query);
  }

  @Get('item/:id')
  @UseGuards(JwtAuthGuard)
  async getItem(@Param('id') id: number) {
    return await this.adminService.getItem(id);
  }

  @Get('categories')
  @UseGuards(JwtAuthGuard)
  async getCategories(@Query() query) {
    return await this.adminService.getCategories(query);
  }

  @Post('category/create')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        name: {
          type: 'string',
          description: 'name of category',
        },
        description: {
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async createCategory(
    @UploadedFile() file: Express.Multer.File,
    @Body() payload,
  ) {
    return await this.adminService.createCategory(file, payload);
  }

  @Get('category/:id')
  @UseGuards(JwtAuthGuard)
  async getCategory(@Param('id') id: number) {
    return await this.adminService.getCategory(id);
  }

  @Put('category/:id')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        name: {
          type: 'string',
          description: 'name of collection',
        },
        description: {
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async updateCategory(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() payload,
  ) {
    payload.id = id;
    return await this.adminService.updateCategory(file, payload);
  }

  @Delete('category/:id')
  @UseGuards(JwtAuthGuard)
  async deleteCategory(@Param('id') id: number) {
    return await this.adminService.deleteCategory(id);
  }

  @Post('changePassword')
  @UseGuards(LocalAuthGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
        newPassword: {
          type: 'string',
        },
      },
    },
  })
  async changePassword(@Req() req, @Body('newPassword') password) {
    return this.authService.changePassword(req.id, password);
  }

  @Get('balance')
  @UseGuards(JwtAuthGuard)
  async getBalance() {
    return await this.adminService.getBalance();
  }

  @Post('payment')
  @UseGuards(JwtAuthGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        address: {
          type: 'string',
        },
        amount: {
          type: 'string',
        },
      },
    },
  })
  async payment(@Body() payload) {
    return await this.adminService.payment(payload);
  }
}

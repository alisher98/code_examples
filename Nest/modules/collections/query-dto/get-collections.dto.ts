import { ApiProperty } from '@nestjs/swagger';

export class GetCollectionsDto {
  @ApiProperty({
    required: false,
    default: 20,
  })
  take: string;

  @ApiProperty({
    required: false,
    default: 0,
  })
  page: string;

  @ApiProperty({
    required: false,
    description: 'Name of collection',
  })
  name: string;

  @ApiProperty({
    required: false,
    description: 'Author username',
  })
  author: string;

  @ApiProperty({
    required: false,
    description: 'Author ID',
  })
  authorId: number;

  @ApiProperty({
    required: false,
    description: 'Mint address of collection',
  })
  mint: string;

  @ApiProperty({
    required: false,
    description: 'Owner username',
  })
  owner: number;

  @ApiProperty({
    required: false,
    description: 'Owner ID',
  })
  ownerId: number;

  @ApiProperty({
    required: false,
    description: 'Collection category ID',
  })
  categoryId: number;

  @ApiProperty({
    required: false,
    description: 'Collection category name',
  })
  category: string;

  @ApiProperty({
    required: false,
    description: 'Collection from admin',
  })
  fromAdmin: boolean;
}

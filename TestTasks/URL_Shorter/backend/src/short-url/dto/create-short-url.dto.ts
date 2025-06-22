import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateShortUrlDto {
  @IsUrl()
  originalUrl: string;

  @IsOptional()
  @MaxLength(20)
  @IsString()
  alias?: string;

  @IsOptional()
  expiresAt?: Date;
}

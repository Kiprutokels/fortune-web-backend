import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdatePageContentDto {
  @ApiProperty()
  @IsString()
  pageKey: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  heroTitle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  heroSubtitle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  heroDescription?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  heroImageUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  processImageUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  complianceImageUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ctaText?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ctaLink?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ctaSecondaryText?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ctaSecondaryLink?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  keywords?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  metadata?: any;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

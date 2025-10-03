import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsBoolean, IsDateString } from 'class-validator';

export class UpdateHeroContentDto {
  
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  trustBadge?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mainHeading?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  subHeading?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  tagline?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  trustPoints?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  primaryCtaText?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  secondaryCtaText?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  chatWidgetUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  createdAt?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  updatedAt?: string;
}
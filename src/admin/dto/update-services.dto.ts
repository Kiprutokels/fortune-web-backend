import { IsArray, IsOptional, IsString, IsBoolean, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ServiceDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  shortDesc?: string;

  @ApiProperty()
  @IsString()
  icon: string;

  @ApiProperty()
  @IsString()
  color: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty()
  @IsArray()
  features: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  benefits?: any[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  processSteps?: any[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  complianceItems?: any[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

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

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  onQuote?: boolean;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  hasProcess?: boolean;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  hasCompliance?: boolean;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  isPopular?: boolean;

  @ApiProperty()
  @IsNumber()
  position: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  price?: string;

  @ApiProperty({ default: 'Learn More' })
  @IsOptional()
  @IsString()
  buttonText?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  buttonLink?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  metadata?: any;
}

export class UpdateServicesDto {
  @ApiProperty({ type: [ServiceDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceDto)
  services: ServiceDto[];
}

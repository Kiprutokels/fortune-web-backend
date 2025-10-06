import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ServiceDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  shortDesc?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  icon: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  features: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  benefits?: Array<{
    title: string;
    description: string;
    stat: string;
    statLabel: string;
  }>;

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
}

export class UpdateServicesDto {
  @ApiProperty({ type: [ServiceDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceDto)
  services: ServiceDto[];
}
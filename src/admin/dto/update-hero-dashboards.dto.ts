import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsNotEmpty, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class HeroStatDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({ enum: ['primary', 'accent'] })
  @IsString()
  @IsNotEmpty()
  color: 'primary' | 'accent';
}

class HeroDashboardDto {
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
  description: string;

  @ApiProperty({ type: [HeroStatDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HeroStatDto)
  stats: HeroStatDto[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  features: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  position?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  createdAt?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  updatedAt?: string;
}

export class UpdateHeroDashboardsDto {
  @ApiProperty({ type: [HeroDashboardDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HeroDashboardDto)
  dashboards: HeroDashboardDto[];
}
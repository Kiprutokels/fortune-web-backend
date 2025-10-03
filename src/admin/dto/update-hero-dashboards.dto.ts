import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsNotEmpty, ValidateNested } from 'class-validator';
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
}

export class UpdateHeroDashboardsDto {
  @ApiProperty({ type: [HeroDashboardDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HeroDashboardDto)
  dashboards: HeroDashboardDto[];
}

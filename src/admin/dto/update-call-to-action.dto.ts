import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsBoolean, IsOptional, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class CTADto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty()
  @IsString()
  pageKey: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsString()
  primaryText: string;

  @ApiProperty()
  @IsString()
  primaryLink: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  secondaryText?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  secondaryLink?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bgColor?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  textColor?: string;

  @ApiProperty()
  @IsNumber()
  position: number;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateCallToActionDto {
  @ApiProperty({ type: [CTADto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CTADto)
  ctas: CTADto[];
}
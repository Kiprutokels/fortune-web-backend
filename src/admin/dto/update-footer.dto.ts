import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsBoolean, IsOptional, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class FooterLinkDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  href: string;

  @ApiProperty()
  @IsNumber()
  position: number;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

class FooterSectionDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNumber()
  position: number;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ type: [FooterLinkDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FooterLinkDto)
  links: FooterLinkDto[];
}

export class UpdateFooterDto {
  @ApiProperty({ type: [FooterSectionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FooterSectionDto)
  sections: FooterSectionDto[];
}
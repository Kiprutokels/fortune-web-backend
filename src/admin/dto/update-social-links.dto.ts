import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsBoolean, IsOptional, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class SocialLinkDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  icon: string;

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

export class UpdateSocialLinksDto {
  @ApiProperty({ type: [SocialLinkDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  socialLinks: SocialLinkDto[];
}
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsBoolean, IsOptional, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class ContactInfoItemDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  label: string;

  @ApiProperty()
  @IsString()
  value: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty()
  @IsNumber()
  position: number;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateContactInfoDto {
  @ApiProperty({ type: [ContactInfoItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactInfoItemDto)
  contactInfo: ContactInfoItemDto[];
}
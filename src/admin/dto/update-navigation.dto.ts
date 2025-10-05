import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class NavItemDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  href?: string | null;

  @ApiProperty()
  @IsNumber()
  position: number;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  hasDropdown?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  createdAt?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  updatedAt?: string;
}

class DropdownItemDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  dropdownDataId?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  href: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    type: String,
    isArray: true,
    required: false,
    example: ['Feature A', 'Feature B'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  position?: number;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  createdAt?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  updatedAt?: string;
}

class DropdownDataItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: () => DropdownItemDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DropdownItemDto)
  items: DropdownItemDto[];
}

export class UpdateNavigationDto {
  @ApiProperty({ type: () => NavItemDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NavItemDto)
  navItems: NavItemDto[];

  @ApiProperty({
    type: () => DropdownDataItemDto,
    required: false,
    additionalProperties: true, // allows dynamic keys like "what-we-offer"
  })
  @IsOptional()
  dropdownData?: Record<string, DropdownDataItemDto>;
}

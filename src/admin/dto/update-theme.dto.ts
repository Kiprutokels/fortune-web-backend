import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class UpdateThemeDto {
  @ApiProperty({ example: '#3b82f6' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'Invalid color format. Use hex format (#RRGGBB)' })
  primaryColor: string;

  @ApiProperty({ example: '#f97316' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'Invalid color format. Use hex format (#RRGGBB)' })
  accentColor: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  companyName?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, IsNumber, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

class TestimonialDto {
  @ApiProperty({ 
    required: false, 
    description: 'Database ID - omit for new testimonials, include for updates',
    example: 'clx123abc456'
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'CEO' })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({ example: 'Acme Corp' })
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiProperty({ example: 'Excellent service that transformed our operations!' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ default: 5, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiProperty({ example: 'https://example.com/avatar.jpg' })
  @IsString()
  @IsNotEmpty()
  avatar: string;

  @ApiProperty({ 
    type: [String], 
    example: ['50% cost reduction', 'Improved efficiency'],
    default: [] 
  })
  @IsArray()
  @IsString({ each: true })
  results: string[];

  @ApiProperty({ required: false, example: 'payroll' })
  @IsOptional()
  @IsString()
  service?: string;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  position: number;
}

export class UpdateTestimonialsDto {
  @ApiProperty({ type: [TestimonialDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestimonialDto)
  testimonials: TestimonialDto[];
}
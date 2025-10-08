import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConsultationDto {
  @ApiProperty({ 
    description: 'Full name of the person requesting consultation',
    example: 'John Doe',
    minLength: 2,
    maxLength: 100
  })
  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name is required' })
  fullName: string;

  @ApiProperty({ 
    description: 'Email address for consultation follow-up',
    example: 'john.doe@company.com',
    format: 'email'
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ 
    description: 'Phone number for direct contact',
    example: '+1-555-123-4567',
    required: false,
    maxLength: 20
  })
  @IsString({ message: 'Phone number must be a string' })
  @IsOptional()
  phone?: string;

  @ApiProperty({ 
    description: 'Company or organization name',
    example: 'Acme Corporation',
    required: false,
    maxLength: 100
  })
  @IsString({ message: 'Company name must be a string' })
  @IsOptional()
  company?: string;

  @ApiProperty({ 
    description: 'Service or solution interested in',
    example: 'Web Development',
    required: false,
    maxLength: 100
  })
  @IsString({ message: 'Service must be a string' })
  @IsOptional()
  service?: string;

  @ApiProperty({ 
    description: 'Project details, requirements, or additional message',
    example: 'We need a modern e-commerce platform with payment integration and inventory management.',
    required: false,
    maxLength: 1000
  })
  @IsString({ message: 'Details must be a string' })
  @IsOptional()
  details?: string;
}

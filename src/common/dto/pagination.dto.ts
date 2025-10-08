import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min, Max } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    description: 'Page number (1-based)',
    example: 1,
    minimum: 1,
    default: 1,
    required: false
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive({ message: 'Page must be a positive number' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
    required: false
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive({ message: 'Limit must be a positive number' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit?: number = 10;
}

export class PaginatedResponseDto<T = any> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Data retrieved successfully' })
  message: string;

  @ApiProperty({
    type: 'object',
    properties: {
      items: {
        type: 'array',
        description: 'Array of items'
      },
      pagination: {
        type: 'object',
        properties: {
          page: { type: 'number', example: 1 },
          limit: { type: 'number', example: 10 },
          total: { type: 'number', example: 50 },
          totalPages: { type: 'number', example: 5 },
          hasNext: { type: 'boolean', example: true },
          hasPrev: { type: 'boolean', example: false }
        }
      }
    }
  })
  data: {
    items: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  timestamp: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T = any> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Operation completed successfully' })
  message: string;

  @ApiProperty()
  data?: T;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', required: false })
  timestamp?: string;
}

export class ErrorResponseDto {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: 'An error occurred' })
  message: string;

  @ApiProperty({ example: 'VALIDATION_ERROR', required: false })
  error?: string;

  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  timestamp: string;

  @ApiProperty({ example: '/api/admin/navigation', required: false })
  path?: string;
}

export class ValidationErrorDto {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: 'Validation failed' })
  message: string;

  @ApiProperty({ example: 'VALIDATION_ERROR' })
  error: string;

  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({
    example: [
      {
        field: 'email',
        message: 'email must be a valid email',
      },
      {
        field: 'password',
        message: 'password must be longer than or equal to 6 characters',
      },
    ],
  })
  validationErrors: Array<{
    field: string;
    message: string;
  }>;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  timestamp: string;

  @ApiProperty({ example: '/api/auth/login' })
  path: string;
}

export class UnauthorizedErrorDto {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: 'Unauthorized access' })
  message: string;

  @ApiProperty({ example: 'UNAUTHORIZED' })
  error: string;

  @ApiProperty({ example: 401 })
  statusCode: number;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  timestamp: string;

  @ApiProperty({ example: '/api/admin/navigation' })
  path: string;
}

export class ForbiddenErrorDto {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: 'Access forbidden' })
  message: string;

  @ApiProperty({ example: 'FORBIDDEN' })
  error: string;

  @ApiProperty({ example: 403 })
  statusCode: number;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  timestamp: string;

  @ApiProperty({ example: '/api/admin/navigation' })
  path: string;
}

export class NotFoundErrorDto {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: 'Resource not found' })
  message: string;

  @ApiProperty({ example: 'NOT_FOUND' })
  error: string;

  @ApiProperty({ example: 404 })
  statusCode: number;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  timestamp: string;

  @ApiProperty({ example: '/api/admin/navigation/123' })
  path: string;
}

export class InternalServerErrorDto {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: 'Internal server error' })
  message: string;

  @ApiProperty({ example: 'INTERNAL_SERVER_ERROR' })
  error: string;

  @ApiProperty({ example: 500 })
  statusCode: number;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  timestamp: string;

  @ApiProperty({ example: '/api/admin/navigation' })
  path: string;
}

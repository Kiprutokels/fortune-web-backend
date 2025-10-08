import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';

/**
 * Decorator to mark endpoints that require JWT authentication
 */
export const ApiJwtAuth = () => {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiSecurity('JWT-auth'),
  );
};

/**
 * Decorator to mark endpoints that are publicly accessible
 */
export const ApiPublic = () => {
  return applyDecorators(
    // No authentication decorators needed for public endpoints
  );
};

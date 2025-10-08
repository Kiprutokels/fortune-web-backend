import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { 
  ApiResponseDto, 
  ErrorResponseDto, 
  ValidationErrorDto, 
  UnauthorizedErrorDto, 
  ForbiddenErrorDto, 
  NotFoundErrorDto, 
  InternalServerErrorDto 
} from '../dto/api-response.dto';

export const ApiSuccessResponse = <TModel extends Type<any>>(
  model: TModel,
  status: number = 200,
  description: string = 'Operation completed successfully',
) => {
  return applyDecorators(
    ApiResponse({
      status,
      description,
      type: ApiResponseDto,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data: { $ref: getSchemaPath(model) },
            },
          },
        ],
      },
    }),
  );
};

export const ApiErrorResponses = () => {
  return applyDecorators(
    ApiResponse({
      status: 400,
      description: 'Bad Request - Validation Error',
      type: ValidationErrorDto,
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing token',
      type: UnauthorizedErrorDto,
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient permissions',
      type: ForbiddenErrorDto,
    }),
    ApiResponse({
      status: 404,
      description: 'Not Found - Resource does not exist',
      type: NotFoundErrorDto,
    }),
    ApiResponse({
      status: 500,
      description: 'Internal Server Error',
      type: InternalServerErrorDto,
    }),
  );
};

// Legacy decorator for backward compatibility
export const ApiResponseDecorator = <TModel extends Type<any>>(
  model: TModel,
  status: number = 200,
) => {
  return ApiSuccessResponse(model, status);
};

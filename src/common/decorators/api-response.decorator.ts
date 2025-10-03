import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiResponseDto = <TModel extends Type<any>>(
  model: TModel,
  status: number = 200,
) => {
  return applyDecorators(
    ApiResponse({
      status,
      schema: {
        allOf: [
          {
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
              data: { $ref: getSchemaPath(model) },
            },
          },
        ],
      },
    }),
  );
};

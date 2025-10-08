
import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Res,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth, ApiBody, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ApiErrorResponses } from '../common/decorators/api-response.decorator';
import type { Response } from 'express';
import { UploadService } from './upload.service';
import * as path from 'path';

@ApiTags('File Upload')
@ApiBearerAuth()
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Upload a file',
    description: 'Upload files to the server. Supports various file types including images, documents, and media files.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload (required)'
        },
        uploadedBy: {
          type: 'string',
          description: 'Optional uploader identifier for tracking'
        }
      },
      required: ['file']
    },
  })
  @ApiQuery({
    name: 'uploadedBy',
    required: false,
    description: 'Identifier for who uploaded the file',
    example: 'admin'
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'File uploaded successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'file-123' },
            filename: { type: 'string', example: 'document.pdf' },
            originalName: { type: 'string', example: 'my-document.pdf' },
            mimetype: { type: 'string', example: 'application/pdf' },
            size: { type: 'number', example: 2048000 },
            url: { type: 'string', example: '/uploads/document.pdf' },
            uploadedBy: { type: 'string', example: 'admin' },
            uploadedAt: { type: 'string', example: '2024-01-15T10:30:00Z' }
          }
        }
      }
    }
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiErrorResponses()
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('uploadedBy') uploadedBy?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    return this.uploadService.uploadFile(file, uploadedBy);
  }

  @Get()
  @ApiOperation({ summary: 'List uploaded files' })
  async listFiles(@Query('uploadedBy') uploadedBy?: string) {
    return this.uploadService.listFiles(uploadedBy);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get file info' })
  async getFile(@Param('id') id: string) {
    return this.uploadService.getFile(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a file' })
  async deleteFile(@Param('id') id: string) {
    await this.uploadService.deleteFile(id);
    return { success: true, message: 'File deleted successfully' };
  }
}

// Serve static files
@Controller()
export class StaticController {
  @Get('uploads/:filename')
  async serveUploadedFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(process.cwd(), 'uploads', filename);
    return res.sendFile(filePath);
  }
}

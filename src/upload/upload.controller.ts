import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  Query,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { 
  ApiTags, 
  ApiOperation, 
  ApiConsumes, 
  ApiBody, 
  ApiResponse,
  ApiQuery 
} from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { Public } from '../common/decorators/public.decorator';
import * as path from 'path';
import * as fs from 'fs';
import { createReadStream } from 'fs';

@ApiTags('Upload')
@Public()
@Controller('admin/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @ApiOperation({ summary: 'Upload a single file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File upload',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload'
        },
        uploadedBy: {
          type: 'string',
          description: 'User who uploaded the file'
        }
      },
      required: ['file']
    },
  })
  @ApiResponse({
    status: 200,
    description: 'File uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            filename: { type: 'string' },
            originalName: { type: 'string' },
            url: { type: 'string' },
            mimetype: { type: 'string' },
            size: { type: 'number' }
          }
        }
      }
    }
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('uploadedBy') uploadedBy?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    return this.uploadService.uploadFile(file, uploadedBy);
  }

  @Post('multiple')
  @ApiOperation({ summary: 'Upload multiple files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Multiple file upload',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Files to upload (max 10)'
        },
        uploadedBy: {
          type: 'string',
          description: 'User who uploaded the files'
        }
      },
      required: ['files']
    },
  })
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('uploadedBy') uploadedBy?: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const results: any[] = [];
    for (const file of files) {
      const result = await this.uploadService.uploadFile(file, uploadedBy);
      results.push(result.data);
    }

    return { success: true, data: results };
  }

  @Get()
  @ApiOperation({ summary: 'List uploaded files' })
  @ApiQuery({ name: 'uploadedBy', required: false, type: String })
  @ApiQuery({ name: 'fileType', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  async listFiles(
    @Query('uploadedBy') uploadedBy?: string,
    @Query('fileType') fileType?: string,
    @Query('search') search?: string,
  ) {
    return this.uploadService.listFiles(uploadedBy, fileType, search);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get file statistics' })
  async getStats() {
    return this.uploadService.getFileStats();
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

// Static file controller (public access)
@Controller('uploads')
@Public()
export class StaticController {
  @Get(':filename')
  @ApiOperation({ summary: 'Serve uploaded file' })
  async getUploadedFile(@Param('filename') filename: string): Promise<StreamableFile> {
    const filePath = path.join(process.cwd(), 'uploads', filename);

    try {
      await fs.promises.access(filePath);
      const stats = await fs.promises.stat(filePath);
      const mimeType = this.getMimeType(filename);

      const file = createReadStream(filePath);
      return new StreamableFile(file, {
        type: mimeType,
        disposition: `inline; filename="${filename}"`,
        length: stats.size,
      });
    } catch {
      throw new BadRequestException('File not found');
    }
  }

  private getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.webp': 'image/webp',
      '.pdf': 'application/pdf',
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }
}

import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as path from 'path';
import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly uploadDir = 'uploads';
  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB
  private readonly allowedMimes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/svg+xml',
    'image/gif',
    'application/pdf',
    'video/mp4',
    'video/webm'
  ];

  constructor(private prisma: PrismaService) {
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await fs.access(this.uploadDir);
      this.logger.log(`Upload directory exists: ${this.uploadDir}`);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
      this.logger.log(`Created upload directory: ${this.uploadDir}`);
    }
  }

  async uploadFile(file: Express.Multer.File, uploadedBy?: string) {
    try {
      if (!file) {
        throw new BadRequestException('No file provided');
      }

      if (file.size > this.maxFileSize) {
        throw new BadRequestException('File size exceeds limit (10MB)');
      }

      if (!this.allowedMimes.includes(file.mimetype)) {
        throw new BadRequestException(`Invalid file type: ${file.mimetype}`);
      }

      const fileExtension = path.extname(file.originalname);
      const fileName = `${uuidv4()}${fileExtension}`;
      const filePath = path.join(this.uploadDir, fileName);

      await fs.writeFile(filePath, file.buffer);

      const fileType = this.getFileType(file.mimetype);

      const fileRecord = await this.prisma.fileUpload.create({
        data: {
          filename: fileName,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: filePath,
          url: `/uploads/${fileName}`, // Store relative path
          fileType,
          uploadedBy,
        },
      });

      this.logger.log(`File uploaded: ${fileName} (${fileType})`);
      
      return {
        success: true,
        data: fileRecord
      };
    } catch (error) {
      this.logger.error('File upload failed:', error);
      throw error;
    }
  }

  private getFileType(mimetype: string): string {
    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype.startsWith('video/')) return 'video';
    if (mimetype === 'application/pdf') return 'document';
    return 'other';
  }

  async deleteFile(id: string): Promise<void> {
    try {
      const fileRecord = await this.prisma.fileUpload.findUnique({
        where: { id },
      });

      if (!fileRecord) {
        throw new BadRequestException('File not found');
      }

      try {
        await fs.unlink(fileRecord.path);
        this.logger.log(`Physical file deleted: ${fileRecord.path}`);
      } catch (error) {
        this.logger.warn(`Could not delete physical file: ${fileRecord.path}`);
      }

      await this.prisma.fileUpload.delete({ where: { id } });
      this.logger.log(`File deleted: ${fileRecord.filename}`);
    } catch (error) {
      this.logger.error('File deletion failed:', error);
      throw error;
    }
  }

  async getFile(id: string) {
    const file = await this.prisma.fileUpload.findUnique({
      where: { id },
    });

    if (!file) {
      throw new BadRequestException('File not found');
    }

    return { success: true, data: file };
  }

  async listFiles(uploadedBy?: string, fileType?: string, search?: string) {
    const where: any = {};
    
    if (uploadedBy) where.uploadedBy = uploadedBy;
    if (fileType && fileType !== 'all') where.fileType = fileType;
    
    if (search) {
      where.originalName = {
        contains: search
      };
    }

    const files = await this.prisma.fileUpload.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    this.logger.log(`Found ${files.length} files with filters: ${JSON.stringify(where)}`);
    return { success: true, data: files };
  }

  async getFileStats() {
    const [total, images, documents, videos] = await Promise.all([
      this.prisma.fileUpload.count(),
      this.prisma.fileUpload.count({ where: { fileType: 'image' } }),
      this.prisma.fileUpload.count({ where: { fileType: 'document' } }),
      this.prisma.fileUpload.count({ where: { fileType: 'video' } }),
    ]);

    const totalSizeResult = await this.prisma.fileUpload.aggregate({
      _sum: { size: true }
    });

    return {
      success: true,
      data: {
        total,
        images,
        documents, 
        videos,
        totalSize: totalSizeResult._sum.size || 0
      }
    };
  }
}

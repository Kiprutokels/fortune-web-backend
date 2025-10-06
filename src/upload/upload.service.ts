import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as path from 'path';
import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly uploadDir = 'uploads';
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  private readonly allowedMimes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/svg+xml'
  ];

  constructor(private prisma: PrismaService) {
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File, uploadedBy?: string): Promise<any> {
    try {
      // Validate file
      if (!file) {
        throw new BadRequestException('No file provided');
      }

      if (file.size > this.maxFileSize) {
        throw new BadRequestException('File size exceeds limit (5MB)');
      }

      if (!this.allowedMimes.includes(file.mimetype)) {
        throw new BadRequestException('Invalid file type. Only images are allowed.');
      }

      // Generate unique filename
      const fileExtension = path.extname(file.originalname);
      const fileName = `${uuidv4()}${fileExtension}`;
      const filePath = path.join(this.uploadDir, fileName);

      // Save file
      await fs.writeFile(filePath, file.buffer);

      // Create database record
      const fileRecord = await this.prisma.fileUpload.create({
        data: {
          filename: fileName,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: filePath,
          url: `/uploads/${fileName}`,
          uploadedBy,
        },
      });

      this.logger.log(`File uploaded successfully: ${fileName}`);
      return fileRecord;
    } catch (error) {
      this.logger.error('File upload failed:', error);
      throw error;
    }
  }

  async deleteFile(id: string): Promise<void> {
    try {
      const fileRecord = await this.prisma.fileUpload.findUnique({
        where: { id },
      });

      if (!fileRecord) {
        throw new BadRequestException('File not found');
      }

      // Delete physical file
      try {
        await fs.unlink(fileRecord.path);
      } catch (error) {
        this.logger.warn(`Could not delete physical file: ${fileRecord.path}`);
      }

      // Delete database record
      await this.prisma.fileUpload.delete({
        where: { id },
      });

      this.logger.log(`File deleted successfully: ${fileRecord.filename}`);
    } catch (error) {
      this.logger.error('File deletion failed:', error);
      throw error;
    }
  }

  async getFile(id: string) {
    return this.prisma.fileUpload.findUnique({
      where: { id },
    });
  }

  async listFiles(uploadedBy?: string) {
    return this.prisma.fileUpload.findMany({
      where: uploadedBy ? { uploadedBy } : {},
      orderBy: { createdAt: 'desc' },
    });
  }
}
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UploadController } from '../upload/upload.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [AdminController, UploadController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
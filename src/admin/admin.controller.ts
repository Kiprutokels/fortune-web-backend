import { 
  Controller, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiConsumes, 
  ApiBody
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { UploadService } from '../upload/upload.service';
import { UpdateNavigationDto } from './dto/update-navigation.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { UpdateHeroDashboardsDto } from './dto/update-hero-dashboards.dto';
import { UpdateHeroContentDto } from './dto/update-hero-content.dto';
import { UpdateServicesDto } from './dto/update-services.dto';
import { UpdateTestimonialsDto } from './dto/update-testimonials.dto';
import { UpdateStatsDto } from './dto/update-stats.dto';
import { UpdateSectionContentDto } from './dto/update-section-content.dto';
import { UpdateFooterDto } from './dto/update-footer.dto';
import { UpdateContactInfoDto } from './dto/update-contact-info.dto';
import { UpdateSocialLinksDto } from './dto/update-social-links.dto';
import { UpdatePageContentDto } from './dto/update-page-content.dto';
import { UpdateCallToActionDto } from './dto/update-call-to-action.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly uploadService: UploadService
  ) {}

  // File Upload
  @Post('upload')
  @ApiOperation({ summary: 'Upload file for admin use' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    return this.uploadService.uploadFile(file, 'admin');
  }

  @Delete('uploads/:id')
  @ApiOperation({ summary: 'Delete uploaded file' })
  async deleteUpload(@Param('id') id: string) {
    return this.uploadService.deleteFile(id);
  }

  // Navigation Management
  @Put('navigation')
  @ApiOperation({ summary: 'Update website navigation structure' })
  async updateNavigation(@Body() updateNavigationDto: UpdateNavigationDto) {
    return this.adminService.updateNavigation(updateNavigationDto);
  }

  @Delete('navigation/:id')
  @ApiOperation({ summary: 'Delete a navigation item' })
  async deleteNavItem(@Param('id') id: string) {
    return this.adminService.deleteNavItem(id);
  }

  // Theme Management
  @Put('theme')
  @ApiOperation({ summary: 'Update website theme configuration' })
  async updateTheme(@Body() updateThemeDto: UpdateThemeDto) {
    return this.adminService.updateTheme(updateThemeDto);
  }

  // Hero Management
  @Put('hero-dashboards')
  @ApiOperation({ summary: 'Update hero dashboard slides' })
  async updateHeroDashboards(@Body() dto: UpdateHeroDashboardsDto) {
    return this.adminService.updateHeroDashboards(dto);
  }

  @Put('hero-content')
  @ApiOperation({ summary: 'Update hero section text content' })
  async updateHeroContent(@Body() dto: UpdateHeroContentDto) {
    return this.adminService.updateHeroContent(dto);
  }

  // Services Management
  @Put('services')
  @ApiOperation({ summary: 'Update all services' })
  async updateServices(@Body() dto: UpdateServicesDto) {
    return this.adminService.updateServices(dto);
  }

  @Delete('services/:id')
  @ApiOperation({ summary: 'Delete a service' })
  async deleteService(@Param('id') id: string) {
    return this.adminService.deleteService(id);
  }

  // Testimonials Management
  @Put('testimonials')
  @ApiOperation({ summary: 'Update all testimonials' })
  async updateTestimonials(@Body() dto: UpdateTestimonialsDto) {
    return this.adminService.updateTestimonials(dto);
  }

  @Delete('testimonials/:id')
  @ApiOperation({ summary: 'Delete a testimonial' })
  async deleteTestimonial(@Param('id') id: string) {
    return this.adminService.deleteTestimonial(id);
  }

  // Stats Management
  @Put('stats')
  @ApiOperation({ summary: 'Update all stats' })
  async updateStats(@Body() dto: UpdateStatsDto) {
    return this.adminService.updateStats(dto);
  }

  @Delete('stats/:id')
  @ApiOperation({ summary: 'Delete a stat' })
  async deleteStat(@Param('id') id: string) {
    return this.adminService.deleteStat(id);
  }

  // Section Content Management
  @Put('section-content')
  @ApiOperation({ summary: 'Update section content (titles, descriptions)' })
  async updateSectionContent(@Body() dto: UpdateSectionContentDto) {
    return this.adminService.updateSectionContent(dto);
  }

  // Footer Management
  @Put('footer')
  @ApiOperation({ summary: 'Update footer sections and links' })
  async updateFooter(@Body() dto: UpdateFooterDto) {
    return this.adminService.updateFooter(dto);
  }

  @Get('footer')
  @ApiOperation({ summary: 'Get footer content for admin' })
  async getFooterContent() {
    return this.adminService.getFooterContent();
  }

  // Contact Info Management
  @Put('contact-info')
  @ApiOperation({ summary: 'Update contact information' })
  async updateContactInfo(@Body() dto: UpdateContactInfoDto) {
    return this.adminService.updateContactInfo(dto);
  }

  @Get('contact-info')
  @ApiOperation({ summary: 'Get contact info for admin' })
  async getContactInfo() {
    return this.adminService.getContactInfo();
  }

  // Social Links Management
  @Put('social-links')
  @ApiOperation({ summary: 'Update social media links' })
  async updateSocialLinks(@Body() dto: UpdateSocialLinksDto) {
    return this.adminService.updateSocialLinks(dto);
  }

  @Get('social-links')
  @ApiOperation({ summary: 'Get social links for admin' })
  async getSocialLinks() {
    return this.adminService.getSocialLinks();
  }

  // Page Content Management
  @Put('page-content')
  @ApiOperation({ summary: 'Update page-specific content' })
  async updatePageContent(@Body() dto: UpdatePageContentDto) {
    return this.adminService.updatePageContent(dto);
  }

  @Get('page-content/:pageKey')
  @ApiOperation({ summary: 'Get page content for admin' })
  async getPageContent(@Param('pageKey') pageKey: string) {
    return this.adminService.getPageContent(pageKey);
  }

  // Call to Action Management
  @Put('call-to-actions')
  @ApiOperation({ summary: 'Update call-to-action sections' })
  async updateCallToActions(@Body() dto: UpdateCallToActionDto) {
    return this.adminService.updateCallToActions(dto);
  }

  @Get('call-to-actions/:pageKey')
  @ApiOperation({ summary: 'Get CTAs for specific page' })
  async getCallToActions(@Param('pageKey') pageKey: string) {
    return this.adminService.getCallToActions(pageKey);
  }
}

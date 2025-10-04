import { 
  Controller, 
  Put, 
  Delete, 
  Body, 
  Param, 
  HttpStatus 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth 
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { UpdateNavigationDto } from './dto/update-navigation.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { UpdateHeroDashboardsDto } from './dto/update-hero-dashboards.dto';
import { UpdateHeroContentDto } from './dto/update-hero-content.dto';
import { UpdateServicesDto } from './dto/update-services.dto';
import { UpdateTestimonialsDto } from './dto/update-testimonials.dto';
import { UpdateStatsDto } from './dto/update-stats.dto';
import { UpdateSectionContentDto } from './dto/update-section-content.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

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
  async updateHeroDashboards(@Body() updateHeroDashboardsDto: UpdateHeroDashboardsDto) {
    return this.adminService.updateHeroDashboards(updateHeroDashboardsDto);
  }

  @Put('hero-content')
  @ApiOperation({ summary: 'Update hero section text content' })
  async updateHeroContent(@Body() updateHeroContentDto: UpdateHeroContentDto) {
    return this.adminService.updateHeroContent(updateHeroContentDto);
  }

  // Services Management
  @Put('services')
  @ApiOperation({ summary: 'Update all services' })
  async updateServices(@Body() updateServicesDto: UpdateServicesDto) {
    return this.adminService.updateServices(updateServicesDto);
  }

  @Delete('services/:id')
  @ApiOperation({ summary: 'Delete a service' })
  async deleteService(@Param('id') id: string) {
    return this.adminService.deleteService(id);
  }

  // Testimonials Management
  @Put('testimonials')
  @ApiOperation({ summary: 'Update all testimonials' })
  async updateTestimonials(@Body() updateTestimonialsDto: UpdateTestimonialsDto) {
    return this.adminService.updateTestimonials(updateTestimonialsDto);
  }

  @Delete('testimonials/:id')
  @ApiOperation({ summary: 'Delete a testimonial' })
  async deleteTestimonial(@Param('id') id: string) {
    return this.adminService.deleteTestimonial(id);
  }

  // Stats Management
  @Put('stats')
  @ApiOperation({ summary: 'Update all stats' })
  async updateStats(@Body() updateStatsDto: UpdateStatsDto) {
    return this.adminService.updateStats(updateStatsDto);
  }

  @Delete('stats/:id')
  @ApiOperation({ summary: 'Delete a stat' })
  async deleteStat(@Param('id') id: string) {
    return this.adminService.deleteStat(id);
  }

  // Section Content Management
  @Put('section-content')
  @ApiOperation({ summary: 'Update section content (titles, descriptions)' })
  async updateSectionContent(@Body() updateSectionContentDto: UpdateSectionContentDto) {
    return this.adminService.updateSectionContent(updateSectionContentDto);
  }
}
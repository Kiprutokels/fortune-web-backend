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

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Put('navigation')
  @ApiOperation({ summary: 'Update website navigation structure' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Navigation updated successfully',
  })
  async updateNavigation(@Body() updateNavigationDto: UpdateNavigationDto) {
    return this.adminService.updateNavigation(updateNavigationDto);
  }

  @Delete('navigation/:id')
  @ApiOperation({ summary: 'Delete a navigation item' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Navigation item deleted successfully',
  })
  async deleteNavItem(@Param('id') id: string) {
    return this.adminService.deleteNavItem(id);
  }

  @Put('theme')
  @ApiOperation({ summary: 'Update website theme configuration' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Theme updated successfully',
  })
  async updateTheme(@Body() updateThemeDto: UpdateThemeDto) {
    return this.adminService.updateTheme(updateThemeDto);
  }

  @Put('hero-dashboards')
  @ApiOperation({ summary: 'Update hero dashboard slides' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Hero dashboards updated successfully',
  })
  async updateHeroDashboards(@Body() updateHeroDashboardsDto: UpdateHeroDashboardsDto) {
    return this.adminService.updateHeroDashboards(updateHeroDashboardsDto);
  }

  @Put('hero-content')
  @ApiOperation({ summary: 'Update hero section text content' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Hero content updated successfully',
  })
  async updateHeroContent(@Body() updateHeroContentDto: UpdateHeroContentDto) {
    return this.adminService.updateHeroContent(updateHeroContentDto);
  }
}

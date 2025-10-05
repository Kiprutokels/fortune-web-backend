import { Controller, Get, Delete, Param, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NavigationService } from './navigation.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Public - Navigation')
@Controller('navigation')
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get complete navigation and content data' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Navigation and content data retrieved successfully',
  })
  async getNavigation() {
    return this.navigationService.getNavigation();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a navigation item (admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Navigation item deleted successfully',
  })
  async deleteNavItem(@Param('id') id: string) {
    return this.navigationService.deleteNavItem(id);
  }
}

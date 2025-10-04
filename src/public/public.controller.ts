import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PublicService } from './public.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Public')
@Controller('')
@Public()
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('navigation')
  @ApiOperation({ summary: 'Get website navigation' })
  async getNavigation() {
    return this.publicService.getNavigation();
  }

  @Get('hero')
  @ApiOperation({ summary: 'Get hero section data' })
  async getHero() {
    return this.publicService.getHero();
  }

  @Get('services')
  @ApiOperation({ summary: 'Get all active services' })
  async getServices() {
    return this.publicService.getServices();
  }

  @Get('testimonials')
  @ApiOperation({ summary: 'Get all active testimonials' })
  async getTestimonials() {
    return this.publicService.getTestimonials();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get all active stats' })
  async getStats() {
    return this.publicService.getStats();
  }

  @Get('section-content/:sectionKey')
  @ApiOperation({ summary: 'Get section content by key' })
  async getSectionContent(@Param('sectionKey') sectionKey: string) {
    return this.publicService.getSectionContent(sectionKey);
  }
}
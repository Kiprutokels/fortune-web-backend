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

   @Get('footer')
  @ApiOperation({ summary: 'Get complete footer content' })
  @ApiResponse({ status: 200, description: 'Footer content retrieved successfully' })
  async getFooter() {
    return this.publicService.getFooter();
  }

  @Get('contact-info')
  @ApiOperation({ summary: 'Get contact information' })
  async getContactInfo() {
    return this.publicService.getContactInfo();
  }

  @Get('social-links')
  @ApiOperation({ summary: 'Get social media links' })
  async getSocialLinks() {
    return this.publicService.getSocialLinks();
  }

  @Get('page-content/:pageKey')
  @ApiOperation({ summary: 'Get page-specific content' })
  async getPageContent(@Param('pageKey') pageKey: string) {
    return this.publicService.getPageContent(pageKey);
  }

  @Get('call-to-actions/:pageKey')
  @ApiOperation({ summary: 'Get call-to-actions for specific page' })
  async getCallToActions(@Param('pageKey') pageKey: string) {
    return this.publicService.getCallToActions(pageKey);
  }

  @Get('services/:slug')
  @ApiOperation({ summary: 'Get service by slug' })
  async getServiceBySlug(@Param('slug') slug: string) {
    return this.publicService.getServiceBySlug(slug);
  }

  @Get('testimonials')
  @ApiOperation({ summary: 'Get all active testimonials' })
  async getTestimonials() {
    return this.publicService.getTestimonials();
  }

}
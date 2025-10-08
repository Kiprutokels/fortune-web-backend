import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PublicService } from './public.service';
import { Public } from '../common/decorators/public.decorator';
import { ContactSubmissionDto } from './dto/contact-submission.dto';
import { ServiceFiltersDto } from './dto/service-filters.dto';
import { TestimonialFiltersDto } from './dto/testimonial-filters.dto';

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
  @ApiResponse({
    status: 200,
    description: 'Footer content retrieved successfully',
  })
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

  @Get('call-to-actions/:pageKey')
  @ApiOperation({ summary: 'Get call-to-actions for specific page' })
  async getCallToActions(@Param('pageKey') pageKey: string) {
    return this.publicService.getCallToActions(pageKey);
  }

  @Get('services/quote-options')
  @ApiOperation({ summary: 'Get services available for quotes' })
  async getQuoteServices() {
    return this.publicService.getQuoteServices();
  }

  @Get('services/categories')
  @ApiOperation({ summary: 'Get all service categories' })
  async getServiceCategories() {
    return this.publicService.getServiceCategories();
  }

  @Get('services')
  @ApiOperation({ summary: 'Get services with filtering' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'featured', required: false, type: Boolean })
  @ApiQuery({ name: 'onQuote', required: false, type: Boolean })
  async getServices(@Query() filters: ServiceFiltersDto) {
    return this.publicService.getServices(filters);
  }

  @Get('services/:slug')
  @ApiOperation({ summary: 'Get service by slug' })
  async getServiceBySlug(@Param('slug') slug: string) {
    return this.publicService.getServiceBySlug(slug);
  }

  @Get('testimonials')
  @ApiOperation({ summary: 'Get testimonials with filtering' })
  async getTestimonials(@Query() filters: TestimonialFiltersDto) {
    return this.publicService.getTestimonials(filters);
  }

  @Post('contact')
  @ApiOperation({ summary: 'Submit contact form' })
  async submitContact(@Body() contactData: ContactSubmissionDto) {
    return this.publicService.submitContact(contactData);
  }

  @Get('page-content/:pageKey')
  @ApiOperation({ summary: 'Get page content' })
  async getPageContent(@Param('pageKey') pageKey: string) {
    return this.publicService.getPageContent(pageKey);
  }
}

import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PublicService } from './public.service';
import { Public } from '../common/decorators/public.decorator';
import { ConsultationDto } from './dto/consultation.dto';
import { ApiErrorResponses } from '../common/decorators/api-response.decorator';

@ApiTags('Public')
@Controller('')
@Public()
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('navigation')
  @ApiOperation({ 
    summary: 'Get website navigation',
    description: 'Retrieve the complete website navigation structure including menu items, links, and hierarchy'
  })
  @ApiResponse({
    status: 200,
    description: 'Navigation data retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Navigation retrieved successfully' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'nav-1' },
              label: { type: 'string', example: 'Home' },
              href: { type: 'string', example: '/' },
              order: { type: 'number', example: 1 },
              children: { type: 'array', items: { type: 'object' } }
            }
          }
        }
      }
    }
  })
  @ApiErrorResponses()
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

  @Post('consultation')
  @ApiOperation({ 
    summary: 'Submit consultation request',
    description: 'Submit a new consultation request. This will create a new consultation record and notify the admin team.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Consultation request submitted successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Consultation request submitted successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'consultation-123' },
            fullName: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john.doe@company.com' },
            status: { type: 'string', example: 'pending' },
            createdAt: { type: 'string', example: '2024-01-15T10:30:00Z' }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid input data - Validation failed',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Validation failed' },
        statusCode: { type: 'number', example: 400 },
        validationErrors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              field: { type: 'string', example: 'email' },
              message: { type: 'string', example: 'email must be a valid email' }
            }
          }
        }
      }
    }
  })
  @ApiErrorResponses()
  async submitConsultation(@Body() consultationDto: ConsultationDto) {
    return this.publicService.submitConsultation(consultationDto);
  }

}
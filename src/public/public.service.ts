import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiResponse } from '../common/interfaces/response.interface';
import { ServiceFiltersDto } from './dto/service-filters.dto';
import { ContactSubmissionDto } from './dto/contact-submission.dto';
import { TestimonialFiltersDto } from './dto/testimonial-filters.dto';

@Injectable()
export class PublicService {
  constructor(private prisma: PrismaService) {}

  async getServices(filters: ServiceFiltersDto): Promise<ApiResponse> {
    try {
      const where: any = { isActive: true };

      if (filters.category) where.category = filters.category;
      if (filters.featured !== undefined) where.isFeatured = filters.featured;
      if (filters.popular !== undefined) where.isPopular = filters.popular;
      if (filters.onQuote !== undefined) where.onQuote = filters.onQuote;

      const services = await this.prisma.service.findMany({
        where,
        orderBy: { position: 'asc' },
      });

      return { success: true, data: services };
    } catch (error) {
      throw new BadRequestException('Failed to fetch services');
    }
  }

  async getQuoteServices(): Promise<ApiResponse> {
    console.log('✅ getQuoteServices() called');
    try {
      const services = await this.prisma.service.findMany({
        where: { isActive: true, onQuote: true },
        orderBy: { position: 'asc' },
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          position: true,
        },
      });

      return { success: true, data: services };
    } catch (error) {
      throw new BadRequestException('Failed to fetch quote services');
    }
  }

  async getServiceBySlug(slug: string): Promise<ApiResponse> {
    try {
      const service = await this.prisma.service.findUnique({
        where: { slug, isActive: true },
      });

      if (!service) {
        throw new NotFoundException(`Service not found: ${slug}`);
      }

      return { success: true, data: service };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Failed to fetch service');
    }
  }

  async getPageContent(pageKey: string): Promise<ApiResponse> {
    try {
      let pageContent = await this.prisma.pageContent.findUnique({
        where: { pageKey, isActive: true },
      });

      if (!pageContent) {
        throw new NotFoundException(`Page content not found for: ${pageKey}`);
      }
      // If page content doesn't exist, create default one
      // if (!pageContent) {
      //   pageContent = await this.createDefaultPageContent(pageKey);
      // }

      return { success: true, data: pageContent };
    } catch (error) {
      throw new BadRequestException('Failed to fetch page content');
    }
  }

  async getSectionContent(sectionKey: string): Promise<ApiResponse> {
    try {
      const sectionContent = await this.prisma.sectionContent.findUnique({
        where: { sectionKey, isActive: true },
      });

      if (!sectionContent) {
        throw new NotFoundException(
          `Section content not found for key: ${sectionKey}`,
        );
      }

      return { success: true, data: sectionContent };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Failed to fetch section content');
    }
  }
  async getServiceCategories(): Promise<ApiResponse> {
    try {
      const categories = await this.prisma.service.findMany({
        where: { isActive: true, category: { not: null } },
        select: { category: true },
        distinct: ['category'],
      });

      const uniqueCategories = categories
        .map((s) => s.category)
        .filter(Boolean)
        .sort();

      return { success: true, data: uniqueCategories };
    } catch (error) {
      throw new BadRequestException('Failed to fetch service categories');
    }
  }
  async getTestimonials(filters: TestimonialFiltersDto): Promise<ApiResponse> {
    try {
      const where: any = { isActive: true };

      if (filters.service) where.service = filters.service;
      if (filters.category) where.category = filters.category;
      if (filters.featured !== undefined) where.isFeatured = filters.featured;
      if (filters.rating) where.rating = { gte: filters.rating };

      const testimonials = await this.prisma.testimonial.findMany({
        where,
        orderBy: { position: 'asc' },
        take: filters.limit || undefined,
      });

      return { success: true, data: testimonials };
    } catch (error) {
      throw new BadRequestException('Failed to fetch testimonials');
    }
  }

  async submitContact(contactData: ContactSubmissionDto): Promise<ApiResponse> {
    try {
      // Validate required fields
      if (
        !contactData.name ||
        !contactData.email ||
        !contactData.phone ||
        !contactData.service ||
        !contactData.message
      ) {
        throw new BadRequestException('Missing required fields');
      }

      const submission = await this.prisma.contactSubmission.create({
        data: {
          name: contactData.name.trim(),
          email: contactData.email.trim().toLowerCase(),
          phone: contactData.phone.trim(),
          company: contactData.company?.trim() || null,
          service: contactData.service.trim(),
          message: contactData.message.trim(),
          source: contactData.source || 'contact-form',
          metadata: contactData.metadata || null,
        },
      });

      // Here you could add email notification logic
      // await this.emailService.sendContactNotification(submission);

      return {
        success: true,
        message: "Thank you! We'll contact you within 24 hours.",
        data: { id: submission.id },
      };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Failed to submit contact form');
    }
  }

  async getCallToActions(pageKey: string): Promise<ApiResponse> {
    try {
      const ctas = await this.prisma.callToAction.findMany({
        where: { pageKey, isActive: true },
        orderBy: { position: 'asc' },
      });

      return { success: true, data: ctas };
    } catch (error) {
      throw new BadRequestException('Failed to fetch call-to-actions');
    }
  }

  async getNavigation() {
    const navItems = await this.prisma.navItem.findMany({
      where: { isActive: true },
      orderBy: { position: 'asc' },
      include: {
        dropdowns: {
          include: {
            items: {
              where: { isActive: true },
              orderBy: { position: 'asc' },
            },
          },
        },
      },
    });

    const themeConfig = await this.prisma.themeConfig.findFirst({
      where: { isActive: true },
    });

    const dropdownData: Record<string, any> = {};
    navItems.forEach((item) => {
      if (item.hasDropdown && item.dropdowns.length > 0) {
        dropdownData[item.key] = {
          title: item.dropdowns[0].title,
          items: item.dropdowns[0].items,
        };
      }
    });

    return {
      success: true,
      data: {
        navItems: navItems.map(({ dropdowns, ...item }) => item),
        dropdownData,
        themeConfig,
      },
    };
  }

  async getHero() {
    const heroDashboards = await this.prisma.heroDashboard.findMany({
      where: { isActive: true },
      orderBy: { position: 'asc' },
    });

    const heroContent = await this.prisma.heroContent.findFirst({
      where: { isActive: true },
    });

    return {
      success: true,
      data: {
        heroDashboards,
        heroContent,
      },
    };
  }

  async getStats(): Promise<ApiResponse> {
    try {
      const stats = await this.prisma.stat.findMany({
        where: { isActive: true },
        orderBy: { position: 'asc' },
      });

      return { success: true, data: stats };
    } catch (error) {
      throw new BadRequestException('Failed to fetch stats');
    }
  }

  async getContactInfo(): Promise<ApiResponse> {
    try {
      const contactInfo = await this.prisma.contactInfo.findMany({
        where: { isActive: true },
        orderBy: { position: 'asc' },
      });

      return { success: true, data: contactInfo };
    } catch (error) {
      throw new BadRequestException('Failed to fetch contact info');
    }
  }

  async getSocialLinks(): Promise<ApiResponse> {
    try {
      const socialLinks = await this.prisma.socialLink.findMany({
        where: { isActive: true },
        orderBy: { position: 'asc' },
      });

      return { success: true, data: socialLinks };
    } catch (error) {
      throw new Error('Failed to fetch social links');
    }
  }

  async getFooter(): Promise<ApiResponse> {
    try {
      const [sections, contactInfo, socialLinks] = await Promise.all([
        this.prisma.footerSection.findMany({
          where: { isActive: true },
          include: {
            links: {
              where: { isActive: true },
              orderBy: { position: 'asc' },
            },
          },
          orderBy: { position: 'asc' },
        }),
        this.prisma.contactInfo.findMany({
          where: { isActive: true },
          orderBy: { position: 'asc' },
        }),
        this.prisma.socialLink.findMany({
          where: { isActive: true },
          orderBy: { position: 'asc' },
        }),
      ]);

      return {
        success: true,
        data: {
          sections,
          contactInfo,
          socialLinks,
        },
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch footer content');
    }
  }
}

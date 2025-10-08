import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiResponse } from 'src/common/interfaces/response.interface';
import { ConsultationDto } from './dto/consultation.dto';

@Injectable()
export class PublicService {
  constructor(private prisma: PrismaService) {}

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

    // Transform data for frontend
    const dropdownData: Record<string, any> = {};
    navItems.forEach(item => {
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
      throw new Error('Failed to fetch footer content');
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
      throw new Error('Failed to fetch contact info');
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

  async getPageContent(pageKey: string): Promise<ApiResponse> {
    try {
      const pageContent = await this.prisma.pageContent.findUnique({
        where: { pageKey, isActive: true },
      });

      if (!pageContent) {
        throw new NotFoundException(`Page content not found for key: ${pageKey}`);
      }

      return { success: true, data: pageContent };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new Error('Failed to fetch page content');
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
      throw new Error('Failed to fetch call-to-actions');
    }
  }
  async getServices(): Promise<ApiResponse> {
    try {
      const services = await this.prisma.service.findMany({
        where: { isActive: true },
        orderBy: { position: 'asc' },
      });

      return { success: true, data: services };
    } catch (error) {
      throw new Error('Failed to fetch services');
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
      throw new Error('Failed to fetch service');
    }
  }

  async getTestimonials(): Promise<ApiResponse> {
    try {
      const testimonials = await this.prisma.testimonial.findMany({
        where: { isActive: true },
        orderBy: { position: 'asc' },
      });

      return { success: true, data: testimonials };
    } catch (error) {
      throw new Error('Failed to fetch testimonials');
    }
  }

  async getStats(): Promise<ApiResponse> {
    try {
      const stats = await this.prisma.stat.findMany({
        where: { isActive: true },
        orderBy: { position: 'asc' },
      });

      return { success: true, data: stats };
    } catch (error) {
      throw new Error('Failed to fetch stats');
    }
  }

  async getSectionContent(sectionKey: string): Promise<ApiResponse> {
    try {
      const sectionContent = await this.prisma.sectionContent.findUnique({
        where: { sectionKey, isActive: true },
      });

      if (!sectionContent) {
        throw new NotFoundException(`Section content not found for key: ${sectionKey}`);
      }

      return { success: true, data: sectionContent };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new Error('Failed to fetch section content');
    }
  }

  async submitConsultation(consultationDto: ConsultationDto): Promise<ApiResponse> {
    try {
      const lead = await this.prisma.lead.create({
        data: {
          leadType: 'consultation',
          fullName: consultationDto.fullName,
          email: consultationDto.email,
          phone: consultationDto.phone,
          company: consultationDto.company,
          serviceInterest: consultationDto.service,
          projectDetails: consultationDto.details,
          message: consultationDto.details, // Using details as message for now
          source: 'website',
          status: 'new',
        },
      });

      return {
        success: true,
        message: 'Consultation request submitted successfully. We will get back to you within 24 hours.',
        data: {
          id: lead.id,
          submittedAt: lead.createdAt,
        },
      };
    } catch (error) {
      console.error('Failed to submit consultation:', error);
      throw new Error('Failed to submit consultation request. Please try again.');
    }
  }
}

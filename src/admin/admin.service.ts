import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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
import { UpdateConsultationFormConfigDto } from './dto/consultation-form-config.dto';
import { ApiResponse } from '../common/interfaces/response.interface';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private prisma: PrismaService) {}

  // Navigation Management
  async updateNavigation(updateNavigationDto: UpdateNavigationDto): Promise<ApiResponse> {
    this.logger.log('📝 Starting navigation update');
    
    try {
      const { navItems, dropdownData } = updateNavigationDto;

      await this.prisma.$transaction(async (tx) => {
        // Update nav items
        for (const item of navItems) {
          const navItemData = {
            name: item.name,
            key: item.key,
            href: item.href || null,
            position: item.position,
            hasDropdown: item.hasDropdown || false,
            isActive: item.isActive !== false,
          };

          await tx.navItem.upsert({
            where: { key: item.key },
            update: navItemData,
            create: navItemData,
          });
        }

        // Update dropdown data
        if (dropdownData) {
          for (const [key, data] of Object.entries(dropdownData)) {
            const navItem = await tx.navItem.findUnique({ where: { key } });

            if (navItem && data) {
              const existingDropdown = await tx.dropdownData.findUnique({
                where: { navItemId: navItem.id },
              });

              let dropdown;
              if (existingDropdown) {
                dropdown = await tx.dropdownData.update({
                  where: { id: existingDropdown.id },
                  data: { title: data.title || 'Dropdown Title' },
                });
                await tx.dropdownItem.deleteMany({
                  where: { dropdownDataId: existingDropdown.id },
                });
              } else {
                dropdown = await tx.dropdownData.create({
                  data: {
                    navItemId: navItem.id,
                    title: data.title || 'Dropdown Title',
                  },
                });
              }

              if (data.items && Array.isArray(data.items)) {
                for (const [index, item] of data.items.entries()) {
                  await tx.dropdownItem.create({
                    data: {
                      name: item.name,
                      href: item.href,
                      description: item.description || '',
                      features: Array.isArray(item.features) ? item.features : [],
                      position: index + 1,
                      isActive: item.isActive !== false,
                      dropdownDataId: dropdown.id,
                    },
                  });
                }
              }
            }
          }
        }
      });

      return { success: true, message: 'Navigation updated successfully' };
    } catch (error) {
      this.logger.error('❌ Navigation update failed:', error);
      throw new BadRequestException('Failed to update navigation');
    }
  }

  async deleteNavItem(id: string): Promise<ApiResponse> {
    try {
      const navItem = await this.prisma.navItem.findUnique({ where: { id } });
      if (!navItem) throw new NotFoundException('Navigation item not found');

      await this.prisma.navItem.delete({ where: { id } });
      return { success: true, message: 'Navigation item deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Failed to delete navigation item');
    }
  }

  // Theme Management
  async updateTheme(updateThemeDto: UpdateThemeDto): Promise<ApiResponse> {
    try {
      await this.prisma.themeConfig.updateMany({
        where: { isActive: true },
        data: updateThemeDto,
      });
      return { success: true, message: 'Theme updated successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to update theme');
    }
  }

  // Hero Management
  async updateHeroDashboards(updateHeroDashboardsDto: UpdateHeroDashboardsDto): Promise<ApiResponse> {
    try {
      const { dashboards } = updateHeroDashboardsDto;

      await this.prisma.$transaction(async (tx) => {
        await tx.heroDashboard.deleteMany({});
        
        for (const [index, dashboard] of dashboards.entries()) {
          await tx.heroDashboard.create({
            data: {
              title: dashboard.title,
              description: dashboard.description,
              stats: JSON.stringify(dashboard.stats || []),
              features: dashboard.features || [],
              imageUrl: dashboard.imageUrl || null,
              position: index + 1,
              isActive: true,
            },
          });
        }
      });

      return { success: true, message: 'Hero dashboards updated successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to update hero dashboards');
    }
  }

  async updateHeroContent(updateHeroContentDto: UpdateHeroContentDto): Promise<ApiResponse> {
    try {
      await this.prisma.heroContent.updateMany({
        where: { isActive: true },
        data: {
          trustBadge: updateHeroContentDto.trustBadge || 'Trusted by 5,000+ Companies',
          mainHeading: updateHeroContentDto.mainHeading || 'Transform Your',
          subHeading: updateHeroContentDto.subHeading || 'HR Operations',
          tagline: updateHeroContentDto.tagline || 'with AI-Powered Solutions',
          description: updateHeroContentDto.description || 'Streamline payroll, optimize talent management.',
          trustPoints: Array.isArray(updateHeroContentDto.trustPoints) 
            ? updateHeroContentDto.trustPoints 
            : ['No Setup Fees', '24/7 Support', 'GDPR Compliant'],
          primaryCtaText: updateHeroContentDto.primaryCtaText || 'Start Free Trial',
          secondaryCtaText: updateHeroContentDto.secondaryCtaText || 'Schedule Demo',
          phoneNumber: updateHeroContentDto.phoneNumber || '0733769149',
          chatWidgetUrl: updateHeroContentDto.chatWidgetUrl || 'https://rag-chat-widget.vercel.app/',
        },
      });

      return { success: true, message: 'Hero content updated successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to update hero content');
    }
  }

  // Services Management
  async updateServices(updateServicesDto: UpdateServicesDto): Promise<ApiResponse> {
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.service.deleteMany({});
        
        for (const service of updateServicesDto.services) {
          await tx.service.create({
            data: {
              title: service.title,
              slug: service.slug,
              description: service.description,
              shortDesc: service.shortDesc,
              icon: service.icon,
              color: service.color,
              features: service.features,
              benefits: service.benefits || [],
              imageUrl: service.imageUrl,
              heroImageUrl: service.heroImageUrl,
              processImageUrl: service.processImageUrl,
              complianceImageUrl: service.complianceImageUrl,
              isActive: service.isActive !== false,
              isFeatured: service.isFeatured || false,
              isPopular: service.isPopular || false,
              position: service.position,
              price: service.price,
              buttonText: service.buttonText || 'Learn More',
              buttonLink: service.buttonLink,
            },
          });
        }
      });

      return { success: true, message: 'Services updated successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to update services');
    }
  }

  async deleteService(id: string): Promise<ApiResponse> {
    try {
      const service = await this.prisma.service.findUnique({ where: { id } });
      if (!service) throw new NotFoundException('Service not found');

      await this.prisma.service.delete({ where: { id } });
      return { success: true, message: 'Service deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Failed to delete service');
    }
  }

  // Testimonials Management
  async updateTestimonials(updateTestimonialsDto: UpdateTestimonialsDto): Promise<ApiResponse> {
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.testimonial.deleteMany({});
        
        for (const testimonial of updateTestimonialsDto.testimonials) {
          await tx.testimonial.create({
            data: {
              name: testimonial.name,
              role: testimonial.role,
              company: testimonial.company,
              content: testimonial.content,
              rating: testimonial.rating || 5,
              avatar: testimonial.avatar,
              results: testimonial.results,
              service: testimonial.service,
              isActive: testimonial.isActive !== false,
              isFeatured: testimonial.isFeatured || false,
              position: testimonial.position,
            },
          });
        }
      });

      return { success: true, message: 'Testimonials updated successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to update testimonials');
    }
  }

  async deleteTestimonial(id: string): Promise<ApiResponse> {
    try {
      const testimonial = await this.prisma.testimonial.findUnique({ where: { id } });
      if (!testimonial) throw new NotFoundException('Testimonial not found');

      await this.prisma.testimonial.delete({ where: { id } });
      return { success: true, message: 'Testimonial deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Failed to delete testimonial');
    }
  }

  // Stats Management
  async updateStats(updateStatsDto: UpdateStatsDto): Promise<ApiResponse> {
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.stat.deleteMany({});
        
        for (const stat of updateStatsDto.stats) {
          await tx.stat.create({
            data: {
              number: stat.number,
              label: stat.label,
              icon: stat.icon,
              color: stat.color || 'text-primary-600',
              isActive: stat.isActive !== false,
              position: stat.position,
            },
          });
        }
      });

      return { success: true, message: 'Stats updated successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to update stats');
    }
  }

  async deleteStat(id: string): Promise<ApiResponse> {
    try {
      const stat = await this.prisma.stat.findUnique({ where: { id } });
      if (!stat) throw new NotFoundException('Stat not found');

      await this.prisma.stat.delete({ where: { id } });
      return { success: true, message: 'Stat deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Failed to delete stat');
    }
  }

  // Section Content Management
  async updateSectionContent(updateSectionContentDto: UpdateSectionContentDto): Promise<ApiResponse> {
    try {
      await this.prisma.sectionContent.upsert({
        where: { sectionKey: updateSectionContentDto.sectionKey },
        update: {
          title: updateSectionContentDto.title,
          subtitle: updateSectionContentDto.subtitle,
          description: updateSectionContentDto.description,
          isActive: updateSectionContentDto.isActive !== false,
        },
        create: {
          sectionKey: updateSectionContentDto.sectionKey,
          title: updateSectionContentDto.title,
          subtitle: updateSectionContentDto.subtitle,
          description: updateSectionContentDto.description,
          isActive: updateSectionContentDto.isActive !== false,
        },
      });

      return { success: true, message: 'Section content updated successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to update section content');
    }
  }

  // Footer Management
  async updateFooter(updateFooterDto: UpdateFooterDto): Promise<ApiResponse> {
    try {
      await this.prisma.$transaction(async (tx) => {
        // Delete existing footer data
        await tx.footerLink.deleteMany({});
        await tx.footerSection.deleteMany({});

        // Create new footer sections and links
        for (const section of updateFooterDto.sections) {
          const createdSection = await tx.footerSection.create({
            data: {
              title: section.title,
              position: section.position,
              isActive: section.isActive !== false,
            },
          });

          // Create links for this section
          for (const link of section.links) {
            await tx.footerLink.create({
              data: {
                footerSectionId: createdSection.id,
                name: link.name,
                href: link.href,
                position: link.position,
                isActive: link.isActive !== false,
              },
            });
          }
        }
      });

      return { success: true, message: 'Footer updated successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to update footer');
    }
  }

  async getFooterContent(): Promise<ApiResponse> {
    try {
      const sections = await this.prisma.footerSection.findMany({
        where: { isActive: true },
        include: {
          links: {
            where: { isActive: true },
            orderBy: { position: 'asc' },
          },
        },
        orderBy: { position: 'asc' },
      });

      return { success: true, data: { sections } };
    } catch (error) {
      throw new BadRequestException('Failed to fetch footer content');
    }
  }

  // Contact Info Management
  async updateContactInfo(updateContactInfoDto: UpdateContactInfoDto): Promise<ApiResponse> {
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.contactInfo.deleteMany({});
        
        for (const info of updateContactInfoDto.contactInfo) {
          await tx.contactInfo.create({
            data: {
              type: info.type,
              label: info.label,
              value: info.value,
              icon: info.icon,
              position: info.position,
              isActive: info.isActive !== false,
            },
          });
        }
      });

      return { success: true, message: 'Contact info updated successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to update contact info');
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

  // Social Links Management
  async updateSocialLinks(updateSocialLinksDto: UpdateSocialLinksDto): Promise<ApiResponse> {
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.socialLink.deleteMany({});
        
        for (const link of updateSocialLinksDto.socialLinks) {
          await tx.socialLink.create({
            data: {
              name: link.name,
              icon: link.icon,
              href: link.href,
              position: link.position,
              isActive: link.isActive !== false,
            },
          });
        }
      });

      return { success: true, message: 'Social links updated successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to update social links');
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
      throw new BadRequestException('Failed to fetch social links');
    }
  }

  // Page Content Management
  async updatePageContent(updatePageContentDto: UpdatePageContentDto): Promise<ApiResponse> {
    try {
      await this.prisma.pageContent.upsert({
        where: { pageKey: updatePageContentDto.pageKey },
        update: {
          title: updatePageContentDto.title,
          subtitle: updatePageContentDto.subtitle,
          description: updatePageContentDto.description,
          heroTitle: updatePageContentDto.heroTitle,
          heroSubtitle: updatePageContentDto.heroSubtitle,
          heroDescription: updatePageContentDto.heroDescription,
          heroImageUrl: updatePageContentDto.heroImageUrl,
          processImageUrl: updatePageContentDto.processImageUrl,
          complianceImageUrl: updatePageContentDto.complianceImageUrl,
          ctaText: updatePageContentDto.ctaText,
          ctaLink: updatePageContentDto.ctaLink,
          ctaSecondaryText: updatePageContentDto.ctaSecondaryText,
          ctaSecondaryLink: updatePageContentDto.ctaSecondaryLink,
          metadata: updatePageContentDto.metadata,
          isActive: updatePageContentDto.isActive !== false,
        },
        create: {
          pageKey: updatePageContentDto.pageKey,
          title: updatePageContentDto.title,
          subtitle: updatePageContentDto.subtitle,
          description: updatePageContentDto.description,
          heroTitle: updatePageContentDto.heroTitle,
          heroSubtitle: updatePageContentDto.heroSubtitle,
          heroDescription: updatePageContentDto.heroDescription,
          heroImageUrl: updatePageContentDto.heroImageUrl,
          processImageUrl: updatePageContentDto.processImageUrl,
          complianceImageUrl: updatePageContentDto.complianceImageUrl,
          ctaText: updatePageContentDto.ctaText,
          ctaLink: updatePageContentDto.ctaLink,
          ctaSecondaryText: updatePageContentDto.ctaSecondaryText,
          ctaSecondaryLink: updatePageContentDto.ctaSecondaryLink,
          metadata: updatePageContentDto.metadata,
          isActive: updatePageContentDto.isActive !== false,
        },
      });

      return { success: true, message: 'Page content updated successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to update page content');
    }
  }

  async getPageContent(pageKey: string): Promise<ApiResponse> {
    try {
      const pageContent = await this.prisma.pageContent.findUnique({
        where: { pageKey },
      });

      return { success: true, data: pageContent };
    } catch (error) {
      throw new BadRequestException('Failed to fetch page content');
    }
  }

  // Call to Action Management
  async updateCallToActions(updateCallToActionDto: UpdateCallToActionDto): Promise<ApiResponse> {
    try {
      await this.prisma.$transaction(async (tx) => {
        // Get all unique page keys from the request
        const pageKeys = [...new Set(updateCallToActionDto.ctas.map(cta => cta.pageKey))];
        
        // Delete existing CTAs for these pages
        for (const pageKey of pageKeys) {
          await tx.callToAction.deleteMany({
            where: { pageKey },
          });
        }
        
        // Create new CTAs
        for (const cta of updateCallToActionDto.ctas) {
          await tx.callToAction.create({
            data: {
              pageKey: cta.pageKey,
              title: cta.title,
              description: cta.description,
              primaryText: cta.primaryText,
              primaryLink: cta.primaryLink,
              secondaryText: cta.secondaryText,
              secondaryLink: cta.secondaryLink,
              bgColor: cta.bgColor,
              textColor: cta.textColor,
              position: cta.position,
              isActive: cta.isActive !== false,
            },
          });
        }
      });

      return { success: true, message: 'Call-to-actions updated successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to update call-to-actions');
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

  // Consultation Requests Management
  async getConsultations(): Promise<ApiResponse> {
    try {
      const consultations = await this.prisma.lead.findMany({
        where: { leadType: 'consultation' },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          company: true,
          serviceInterest: true,
          projectDetails: true,
          status: true,
          source: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return { success: true, data: consultations };
    } catch (error) {
      this.logger.error('Failed to fetch consultations:', error);
      throw new BadRequestException('Failed to fetch consultation requests');
    }
  }

  async updateConsultationStatus(id: string, status: string): Promise<ApiResponse> {
    try {
      const validStatuses = ['new', 'in_progress', 'closed'];
      if (!validStatuses.includes(status)) {
        throw new BadRequestException('Invalid status. Must be one of: new, in_progress, closed');
      }

      const consultation = await this.prisma.lead.findUnique({
        where: { id },
      });

      if (!consultation) {
        throw new NotFoundException('Consultation request not found');
      }

      const updatedConsultation = await this.prisma.lead.update({
        where: { id },
        data: { status },
        select: {
          id: true,
          fullName: true,
          email: true,
          status: true,
          updatedAt: true,
        },
      });

      this.logger.log(`Consultation ${id} status updated to ${status}`);
      return { 
        success: true, 
        message: 'Consultation request status updated successfully',
        data: updatedConsultation 
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Failed to update consultation status:', error);
      throw new BadRequestException('Failed to update consultation request status');
    }
  }

  // Consultation Form Configuration Management
  async getConsultationFormConfig(): Promise<ApiResponse> {
    try {
      let config = await this.prisma.consultationFormConfig.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      });

      // If no config exists, create a default one
      if (!config) {
        const defaultFields = [
          {
            name: 'fullName',
            label: 'Full Name',
            type: 'text',
            placeholder: 'Your full name',
            required: true,
            position: 1
          },
          {
            name: 'email',
            label: 'Email Address',
            type: 'email',
            placeholder: 'your@email.com',
            required: true,
            position: 2
          },
          {
            name: 'phone',
            label: 'Phone Number',
            type: 'tel',
            placeholder: '+254 7XX XXX XXX',
            required: false,
            position: 3
          },
          {
            name: 'company',
            label: 'Company Name',
            type: 'text',
            placeholder: 'Your company',
            required: false,
            position: 4
          },
          {
            name: 'serviceInterest',
            label: 'Service Interested In',
            type: 'select',
            placeholder: 'Select a service',
            required: true,
            position: 5
          },
          {
            name: 'projectDetails',
            label: 'Project Details',
            type: 'textarea',
            placeholder: 'Tell us about your HR challenges and what you\'re hoping to achieve...',
            required: true,
            position: 6
          }
        ];

        const defaultServices = [
          { value: 'Payroll Management', label: 'Payroll Management' },
          { value: 'Recruitment Services', label: 'Recruitment Services' },
          { value: 'Time & Attendance', label: 'Time & Attendance' },
          { value: 'HR Management System', label: 'HR Management System' },
          { value: 'Staff Outsourcing', label: 'Staff Outsourcing' },
          { value: 'CCTV Solutions', label: 'CCTV Solutions' },
          { value: 'Web Development', label: 'Web Development' },
          { value: 'Custom Solutions', label: 'Custom Solutions' }
        ];

        config = await this.prisma.consultationFormConfig.create({
          data: {
            formTitle: 'Request Free Consultation',
            formSubtitle: 'Fill out the form and we\'ll get back to you within 24 hours.',
            fields: defaultFields as any,
            services: defaultServices as any,
            submitText: 'Send Message',
            successMessage: 'Thank you! We\'ll contact you within 24 hours.',
            isActive: true
          }
        });
      }

      return { success: true, data: config };
    } catch (error) {
      this.logger.error('Failed to get consultation form config:', error);
      throw new BadRequestException('Failed to fetch consultation form configuration');
    }
  }

  async updateConsultationFormConfig(dto: UpdateConsultationFormConfigDto): Promise<ApiResponse> {
    try {
      // Get the current active config
      let config = await this.prisma.consultationFormConfig.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      });

      if (config) {
        // Update existing config
        config = await this.prisma.consultationFormConfig.update({
          where: { id: config.id },
          data: {
            formTitle: dto.formTitle,
            formSubtitle: dto.formSubtitle,
            fields: dto.fields as any,
            services: dto.services as any,
            submitText: dto.submitText,
            successMessage: dto.successMessage,
            isActive: dto.isActive,
            updatedAt: new Date()
          }
        });
      } else {
        // Create new config if none exists
        config = await this.prisma.consultationFormConfig.create({
          data: {
            formTitle: dto.formTitle || 'Request Free Consultation',
            formSubtitle: dto.formSubtitle || 'Fill out the form and we\'ll get back to you within 24 hours.',
            fields: (dto.fields || []) as any,
            services: (dto.services || []) as any,
            submitText: dto.submitText || 'Send Message',
            successMessage: dto.successMessage || 'Thank you! We\'ll contact you within 24 hours.',
            isActive: dto.isActive !== false
          }
        });
      }

      this.logger.log('Consultation form configuration updated successfully');
      return { 
        success: true, 
        message: 'Consultation form configuration updated successfully',
        data: config 
      };
    } catch (error) {
      this.logger.error('Failed to update consultation form config:', error);
      throw new BadRequestException('Failed to update consultation form configuration');
    }
  }
}
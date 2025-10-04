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
              isActive: service.isActive !== false,
              isFeatured: service.isFeatured || false,
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
}
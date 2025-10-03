import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateNavigationDto } from './dto/update-navigation.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { UpdateHeroDashboardsDto } from './dto/update-hero-dashboards.dto';
import { UpdateHeroContentDto } from './dto/update-hero-content.dto';
import { ApiResponse } from '../common/interfaces/response.interface';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private prisma: PrismaService) {}

  async updateNavigation(updateNavigationDto: UpdateNavigationDto): Promise<ApiResponse> {
    this.logger.log('📝 Starting navigation update');
    this.logger.debug('Navigation data:', JSON.stringify(updateNavigationDto, null, 2));

    try {
      const { navItems, dropdownData } = updateNavigationDto;

      const result = await this.prisma.$transaction(async (tx) => {
        this.logger.log('🔄 Processing navigation items...');
        
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

          const updatedItem = await tx.navItem.upsert({
            where: { key: item.key },
            update: navItemData,
            create: navItemData,
          });

          this.logger.debug(`✅ Processed nav item: ${updatedItem.name} (${updatedItem.id})`);
        }

        // Update dropdown data
        if (dropdownData) {
          this.logger.log('🔄 Processing dropdown data...');
          
          for (const [key, data] of Object.entries(dropdownData)) {
            const navItem = await tx.navItem.findUnique({
              where: { key },
            });

            if (navItem && data) {
              this.logger.debug(`🔄 Processing dropdown for: ${key}`);
              
              // Check if dropdown exists
              const existingDropdown = await tx.dropdownData.findUnique({
                where: { navItemId: navItem.id },
              });

              let dropdown;
              if (existingDropdown) {
                // Update existing dropdown
                dropdown = await tx.dropdownData.update({
                  where: { id: existingDropdown.id },
                  data: { title: data.title || 'Dropdown Title' },
                });

                // Delete existing dropdown items
                await tx.dropdownItem.deleteMany({
                  where: { dropdownDataId: existingDropdown.id },
                });
                
                this.logger.debug(`🗑️ Cleared existing dropdown items for: ${key}`);
              } else {
                // Create new dropdown
                dropdown = await tx.dropdownData.create({
                  data: {
                    navItemId: navItem.id,
                    title: data.title || 'Dropdown Title',
                  },
                });
                
                this.logger.debug(`➕ Created new dropdown for: ${key}`);
              }

              // Add dropdown items
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
                
                this.logger.debug(`✅ Added ${data.items.length} dropdown items for: ${key}`);
              }
            }
          }
        }
      });

      this.logger.log('✅ Navigation update completed successfully');

      return {
        success: true,
        message: 'Navigation updated successfully',
      };
    } catch (error) {
      this.logger.error('❌ Navigation update failed:', error);
      throw new BadRequestException('Failed to update navigation');
    }
  }

  async deleteNavItem(id: string): Promise<ApiResponse> {
    this.logger.log(`🗑️ Attempting to delete navigation item: ${id}`);
    
    try {
      const navItem = await this.prisma.navItem.findUnique({
        where: { id },
        include: { dropdowns: true },
      });

      if (!navItem) {
        this.logger.warn(`❌ Navigation item not found: ${id}`);
        throw new NotFoundException('Navigation item not found');
      }

      await this.prisma.navItem.delete({
        where: { id },
      });

      this.logger.log(`✅ Successfully deleted navigation item: ${navItem.name} (${id})`);

      return {
        success: true,
        message: 'Navigation item deleted successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`❌ Failed to delete navigation item ${id}:`, error);
      throw new BadRequestException('Failed to delete navigation item');
    }
  }

  async updateTheme(updateThemeDto: UpdateThemeDto): Promise<ApiResponse> {
    this.logger.log('🎨 Starting theme update');
    this.logger.debug('Theme data:', JSON.stringify(updateThemeDto, null, 2));

    try {
      const { primaryColor, accentColor, logoUrl, companyName } = updateThemeDto;

      const result = await this.prisma.themeConfig.updateMany({
        where: { isActive: true },
        data: {
          primaryColor,
          accentColor,
          logoUrl: logoUrl || null,
          companyName: companyName || 'Fortune Technologies',
        },
      });

      this.logger.log(`✅ Theme updated successfully. Records affected: ${result.count}`);

      return {
        success: true,
        message: 'Theme updated successfully',
      };
    } catch (error) {
      this.logger.error('❌ Theme update failed:', error);
      throw new BadRequestException('Failed to update theme');
    }
  }

  async updateHeroDashboards(updateHeroDashboardsDto: UpdateHeroDashboardsDto): Promise<ApiResponse> {
    this.logger.log('📊 Starting hero dashboards update');
    this.logger.debug('Dashboard data:', JSON.stringify(updateHeroDashboardsDto, null, 2));

    try {
      const { dashboards } = updateHeroDashboardsDto;

      await this.prisma.$transaction(async (tx) => {
        // Delete existing dashboards
        const deletedCount = await tx.heroDashboard.deleteMany({});
        this.logger.debug(`🗑️ Deleted ${deletedCount.count} existing dashboards`);

        // Create new dashboards
        for (const [index, dashboard] of dashboards.entries()) {
          const createdDashboard = await tx.heroDashboard.create({
            data: {
              title: dashboard.title,
              description: dashboard.description,
              stats: JSON.parse(JSON.stringify(dashboard.stats || [])),
              features: JSON.parse(JSON.stringify(dashboard.features || [])),
              imageUrl: dashboard.imageUrl || null,
              position: index + 1,
              isActive: true,
            },
          });
          
          this.logger.debug(`✅ Created dashboard: ${createdDashboard.title} (${createdDashboard.id})`);
        }
      });

      this.logger.log(`✅ Hero dashboards updated successfully. Created ${dashboards.length} dashboards`);

      return {
        success: true,
        message: 'Hero dashboards updated successfully',
      };
    } catch (error) {
      this.logger.error('❌ Hero dashboards update failed:', error);
      throw new BadRequestException('Failed to update hero dashboards');
    }
  }

  async updateHeroContent(updateHeroContentDto: UpdateHeroContentDto): Promise<ApiResponse> {
    this.logger.log('📝 Starting hero content update');
    this.logger.debug('Hero content data:', JSON.stringify(updateHeroContentDto, null, 2));

    try {
      const {
        trustBadge,
        mainHeading,
        subHeading,
        tagline,
        description,
        trustPoints,
        primaryCtaText,
        secondaryCtaText,
        phoneNumber,
        chatWidgetUrl,
      } = updateHeroContentDto;

      const result = await this.prisma.heroContent.updateMany({
        where: { isActive: true },
        data: {
          trustBadge: trustBadge || 'Trusted by 5,000+ Companies',
          mainHeading: mainHeading || 'Transform Your',
          subHeading: subHeading || 'HR Operations',
          tagline: tagline || 'with AI-Powered Solutions',
          description: description || 'Streamline payroll, optimize talent management, and enhance employee experiences.',
          trustPoints: Array.isArray(trustPoints) ? trustPoints : ['No Setup Fees', '24/7 Support', 'GDPR Compliant'],
          primaryCtaText: primaryCtaText || 'Start Free Trial',
          secondaryCtaText: secondaryCtaText || 'Schedule Demo',
          phoneNumber: phoneNumber || '0733769149',
          chatWidgetUrl: chatWidgetUrl || 'https://rag-chat-widget.vercel.app/',
        },
      });

      this.logger.log(`✅ Hero content updated successfully. Records affected: ${result.count}`);

      return {
        success: true,
        message: 'Hero content updated successfully',
      };
    } catch (error) {
      this.logger.error('❌ Hero content update failed:', error);
      throw new BadRequestException('Failed to update hero content');
    }
  }
}
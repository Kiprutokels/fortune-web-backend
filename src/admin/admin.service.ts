import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateNavigationDto } from './dto/update-navigation.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { UpdateHeroDashboardsDto } from './dto/update-hero-dashboards.dto';
import { UpdateHeroContentDto } from './dto/update-hero-content.dto';
import { ApiResponse } from '../common/interfaces/response.interface';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async updateNavigation(updateNavigationDto: UpdateNavigationDto): Promise<ApiResponse> {
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
            const navItem = await tx.navItem.findUnique({
              where: { key },
            });

            if (navItem && data) {
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
              } else {
                // Create new dropdown
                dropdown = await tx.dropdownData.create({
                  data: {
                    navItemId: navItem.id,
                    title: data.title || 'Dropdown Title',
                  },
                });
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
              }
            }
          }
        }
      });

      return {
        success: true,
        message: 'Navigation updated successfully',
      };
    } catch (error) {
      throw new BadRequestException('Failed to update navigation');
    }
  }

  async deleteNavItem(id: string): Promise<ApiResponse> {
    try {
      const navItem = await this.prisma.navItem.findUnique({
        where: { id },
      });

      if (!navItem) {
        throw new NotFoundException('Navigation item not found');
      }

      await this.prisma.navItem.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Navigation item deleted successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete navigation item');
    }
  }

  async updateTheme(updateThemeDto: UpdateThemeDto): Promise<ApiResponse> {
    try {
      const { primaryColor, accentColor, logoUrl, companyName } = updateThemeDto;

      await this.prisma.themeConfig.updateMany({
        where: { isActive: true },
        data: {
          primaryColor,
          accentColor,
          logoUrl: logoUrl || null,
          companyName: companyName || 'Fortune Technologies',
        },
      });

      return {
        success: true,
        message: 'Theme updated successfully',
      };
    } catch (error) {
      throw new BadRequestException('Failed to update theme');
    }
  }
async updateHeroDashboards(updateHeroDashboardsDto: UpdateHeroDashboardsDto): Promise<ApiResponse> {
  try {
    const { dashboards } = updateHeroDashboardsDto;

    await this.prisma.$transaction(async (tx) => {
      // Delete existing dashboards
      await tx.heroDashboard.deleteMany({});

      // Create new dashboards
      for (const [index, dashboard] of dashboards.entries()) {
        await tx.heroDashboard.create({
          data: {
            title: dashboard.title,
            description: dashboard.description,
            // ✅ Ensure JSON-safe values for Prisma
            stats: JSON.parse(JSON.stringify(dashboard.stats || [])),
            features: JSON.parse(JSON.stringify(dashboard.features || [])),
            position: index + 1,
            isActive: true,
          },
        });
      }
    });

    return {
      success: true,
      message: 'Hero dashboards updated successfully',
    };
  } catch (error) {
    throw new BadRequestException('Failed to update hero dashboards');
  }
}


  async updateHeroContent(updateHeroContentDto: UpdateHeroContentDto): Promise<ApiResponse> {
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

      await this.prisma.heroContent.updateMany({
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

      return {
        success: true,
        message: 'Hero content updated successfully',
      };
    } catch (error) {
      throw new BadRequestException('Failed to update hero content');
    }
  }
}

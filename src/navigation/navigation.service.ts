import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiResponse } from '../common/interfaces/response.interface';

@Injectable()
export class NavigationService {
  constructor(private prisma: PrismaService) {}

  async getNavigation(): Promise<ApiResponse> {
    try {
      const [navItems, themeConfig] = await Promise.allSettled([
        this.prisma.navItem.findMany({
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
        }),
        this.prisma.themeConfig.findFirst({
          where: { isActive: true },
        }),
      ]);

      // Transform data for frontend
      const dropdownData: Record<string, any> = {};
      if (navItems.status === 'fulfilled') {
        navItems.value.forEach((item) => {
          if (item.dropdowns.length > 0) {
            const dropdown = item.dropdowns[0];
            dropdownData[item.key] = {
              title: dropdown.title,
              items: dropdown.items,
            };
          }
        });
      }

      return {
        success: true,
        data: {
          navItems: navItems.status === 'fulfilled' 
            ? navItems.value.map(({ dropdowns, ...item }) => item) 
            : [],
          dropdownData,
          themeConfig: themeConfig.status === 'fulfilled' ? themeConfig.value : null,
        },
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch navigation data');
    }
  }

  async deleteNavItem(id: string): Promise<ApiResponse> {
    try {
      const navItem = await this.prisma.navItem.findUnique({
        where: { id },
        include: { dropdowns: true },
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
}

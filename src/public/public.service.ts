import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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

  async getServices() {
    const services = await this.prisma.service.findMany({
      where: { isActive: true },
      orderBy: { position: 'asc' },
    });

    return {
      success: true,
      data: services,
    };
  }

  async getTestimonials() {
    const testimonials = await this.prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { position: 'asc' },
    });

    return {
      success: true,
      data: testimonials,
    };
  }

  async getStats() {
    const stats = await this.prisma.stat.findMany({
      where: { isActive: true },
      orderBy: { position: 'asc' },
    });

    return {
      success: true,
      data: stats,
    };
  }

  async getSectionContent(sectionKey: string) {
    const content = await this.prisma.sectionContent.findUnique({
      where: { sectionKey, isActive: true },
    });

    return {
      success: true,
      data: content,
    };
  }
}

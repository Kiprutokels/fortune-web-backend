import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiResponse } from '../common/interfaces/response.interface';

@Injectable()
export class HeroService {
  constructor(private prisma: PrismaService) {}

  async getHeroData(): Promise<ApiResponse> {
    try {
      const [heroDashboards, heroContent] = await Promise.allSettled([
        this.prisma.heroDashboard.findMany({
          where: { isActive: true },
          orderBy: { position: 'asc' },
        }),
        this.prisma.heroContent.findFirst({
          where: { isActive: true },
        }),
      ]);

      return {
        success: true,
        data: {
          heroDashboards: heroDashboards.status === 'fulfilled' ? heroDashboards.value : [],
          heroContent: heroContent.status === 'fulfilled' ? heroContent.value : null,
        },
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch hero data');
    }
  }
}

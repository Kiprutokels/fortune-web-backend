import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HeroService } from './hero.service';
import { Public } from '../common/decorators/public.decorator'; // <-- import here

@ApiTags('Public - Hero')
@Controller('hero')
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  @Public() // <-- mark this endpoint as public
  @Get()
  @ApiOperation({ summary: 'Get hero section data' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Hero data retrieved successfully',
  })
  async getHeroData() {
    return this.heroService.getHeroData();
  }
}

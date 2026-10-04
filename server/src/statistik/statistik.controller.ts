import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StatistikService } from './statistik.service';

@Controller('statistik')
export class StatistikController {
  constructor(private readonly statistikService: StatistikService) {}

  /** Agregat publik untuk landing page — tanpa auth, hanya angka. */
  @Get('publik')
  async publik() {
    const s = await this.statistikService.get();
    return { total: s.total, terverifikasi: s.terverifikasi, digital: s.digital };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  get() {
    return this.statistikService.get();
  }
}

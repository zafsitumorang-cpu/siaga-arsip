import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StatistikService } from './statistik.service';

@Controller('statistik')
@UseGuards(JwtAuthGuard)
export class StatistikController {
  constructor(private readonly statistikService: StatistikService) {}

  @Get()
  get() {
    return this.statistikService.get();
  }
}

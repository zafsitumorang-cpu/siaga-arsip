import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ArsipService } from './arsip.service';
import { QueryArsipDto } from './dto/query-arsip.dto';

@Controller('arsip')
@UseGuards(JwtAuthGuard)
export class ArsipController {
  constructor(private readonly arsipService: ArsipService) {}

  @Get()
  findAll(@Query() query: QueryArsipDto) {
    return this.arsipService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.arsipService.findOne(id);
  }
}

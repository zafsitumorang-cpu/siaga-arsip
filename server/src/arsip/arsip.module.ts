import { Module } from '@nestjs/common';
import { ArsipController } from './arsip.controller';
import { ArsipService } from './arsip.service';

@Module({
  controllers: [ArsipController],
  providers: [ArsipService],
})
export class ArsipModule {}

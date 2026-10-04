import { Module } from '@nestjs/common';
import { ArsipController } from './arsip.controller';
import { ArsipService } from './arsip.service';

import { ArsipUploadController } from './arsip-upload.controller';
import { ArsipUploadService } from './arsip-upload.service';

@Module({
  controllers: [ArsipController, ArsipUploadController],
  providers: [ArsipService, ArsipUploadService],
})
export class ArsipModule {}

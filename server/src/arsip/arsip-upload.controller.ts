import {
  BadRequestException,
  Controller,
  Body,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  PayloadTooLargeException,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { existsSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ArsipUploadService,
  UPLOADS_DIR,
  buildStorageFilename,
  ensureUploadsDir,
  validateUpload,
} from './arsip-upload.service';

ensureUploadsDir();

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

@Controller('arsip')
@UseGuards(JwtAuthGuard)
export class ArsipUploadController {
  constructor(
    @Inject(ArsipUploadService) private readonly arsipUploadService: ArsipUploadService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          ensureUploadsDir();
          cb(null, UPLOADS_DIR);
        },
        filename: (_req, file, cb) => cb(null, buildStorageFilename(file.originalname)),
      }),
      limits: { fileSize: MAX_SIZE + 1 },
      fileFilter: (_req, file, cb) => {
        const result = validateUpload(file.mimetype, file.originalname, file.size);
        if (!result.ok) {
          cb(new BadRequestException(result.reason), false);
          return;
        }
        cb(null, true);
      },
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() body: {
      judul?: string;
      nomor?: string;
      subbagianId?: string;
      tanggalDokumen?: string;
    },
  ) {
    if (!body.judul || !body.subbagianId) {
      throw new BadRequestException('judul dan subbagianId wajib diisi');
    }
    const subbagianId = Number(body.subbagianId);
    if (!Number.isInteger(subbagianId) || subbagianId < 1) {
      throw new BadRequestException('subbagianId tidak valid');
    }
    if (!file) {
      throw new BadRequestException('File wajib diunggah');
    }
    // fileFilter sudah memanggil validateUpload; lakukan lagi di sini sebagai sumber kebenaran.
    const result = validateUpload(file.mimetype, file.originalname, file.size);
    if (!result.ok) {
      throw new BadRequestException(result.reason);
    }
    return this.arsipUploadService.create({
      judul: body.judul,
      nomor: body.nomor,
      subbagianId,
      tanggalDokumen: body.tanggalDokumen,
      fileNama: file.originalname,
      filePath: file.filename,
    });
  }

  @Patch(':id/verifikasi')
  verifikasi(@Param('id', ParseIntPipe) id: number) {
    return this.arsipUploadService.verifikasi(id);
  }

  @Get(':id/file')
  async streamFile(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const info = await this.arsipUploadService.getFilePath(id);
    if (!info || !existsSync(info.absolutePath)) {
      return res.status(404).json({ statusCode: 404, message: 'File tidak ditemukan' });
    }
    return res.type(info.mimetype).sendFile(info.absolutePath);
  }
}

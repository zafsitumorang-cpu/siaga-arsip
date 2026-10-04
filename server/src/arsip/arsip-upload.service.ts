import {
  BadRequestException,
  Injectable,
  NotFoundException,
  PayloadTooLargeException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { mkdirSync } from 'fs';
import { extname, join } from 'path';
import { StatusArsip } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ArsipDto, toArsipDto } from './dto/arsip.dto';

const ALLOWED_MIMETYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export const UPLOADS_DIR = join(process.cwd(), 'uploads');

export function ensureUploadsDir(): void {
  mkdirSync(UPLOADS_DIR, { recursive: true });
}

export function buildStorageFilename(originalname: string): string {
  const ext = extname(originalname).toLowerCase();
  return `${randomUUID()}${ext}`;
}

export interface ValidateUploadResult {
  ok: boolean;
  reason?: string;
}

export function validateUpload(
  mimetype: string,
  originalname: string,
  size: number,
): ValidateUploadResult {
  if (!ALLOWED_MIMETYPES.includes(mimetype)) {
    return { ok: false, reason: `Tipe file ${mimetype} tidak diizinkan` };
  }
  const ext = extname(originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return { ok: false, reason: `Ekstensi file ${ext} tidak diizinkan` };
  }
  if (size > MAX_SIZE) {
    return { ok: false, reason: 'Ukuran file melebihi 10 MB' };
  }
  return { ok: true };
}

export class CreateArsipDto {
  judul!: string;
  nomor?: string;
  subbagianId!: number;
  tanggalDokumen?: string;
  fileNama?: string;
  filePath?: string;
}

@Injectable()
export class ArsipUploadService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateArsipDto): Promise<ArsipDto> {
    try {
      const record = await this.prisma.arsip.create({
        data: {
          judul: dto.judul,
          nomor: dto.nomor || null,
          subbagianId: dto.subbagianId,
          tanggalDokumen: dto.tanggalDokumen ? new Date(dto.tanggalDokumen) : null,
          status: StatusArsip.MENUNGGU,
          isDigital: Boolean(dto.fileNama),
          fileNama: dto.fileNama ?? null,
          filePath: dto.filePath ?? null,
        },
        include: { subbagian: true },
      });
      return toArsipDto(record);
    } catch (err) {
      // Compensating delete: baris DB gagal dibuat → hapus file yang sudah tersimpan.
      if (dto.filePath) {
        const { unlink } = await import('fs/promises');
        await unlink(join(UPLOADS_DIR, dto.filePath)).catch(() => undefined);
      }
      throw err;
    }
  }

  async verifikasi(id: number): Promise<ArsipDto> {
    // Idempotent: updateMany dengan filter status MENUNGGU aman diulang.
    await this.prisma.arsip.updateMany({
      where: { id, status: StatusArsip.MENUNGGU },
      data: { status: StatusArsip.TERVERIFIKASI },
    });
    const record = await this.prisma.arsip.findUnique({
      where: { id },
      include: { subbagian: true },
    });
    if (!record) {
      throw new NotFoundException(`Arsip dengan id ${id} tidak ditemukan`);
    }
    return toArsipDto(record);
  }

  async getFilePath(id: number): Promise<{ absolutePath: string; mimetype: string } | null> {
    const record = await this.prisma.arsip.findUnique({
      where: { id },
      select: { filePath: true, fileNama: true },
    });
    if (!record || !record.filePath) {
      return null;
    }
    const ext = extname(record.filePath).toLowerCase();
    const mimetypeByExt: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
    };
    return {
      absolutePath: join(UPLOADS_DIR, record.filePath),
      mimetype: mimetypeByExt[ext] ?? 'application/octet-stream',
    };
  }
}

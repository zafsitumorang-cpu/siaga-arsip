import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, StatusArsip } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { QueryArsipDto } from './dto/query-arsip.dto';

export interface ArsipDto {
  id: number;
  nomor: string | null;
  judul: string;
  subbagianId: number;
  subbagianNama: string;
  tanggalDokumen: Date | null;
  status: StatusArsip;
  isDigital: boolean;
  fileNama: string | null;
  createdAt: Date;
}

type ArsipWithSubbagian = Prisma.ArsipGetPayload<{ include: { subbagian: true } }>;

function toDto(record: ArsipWithSubbagian): ArsipDto {
  return {
    id: record.id,
    nomor: record.nomor,
    judul: record.judul,
    subbagianId: record.subbagianId,
    subbagianNama: record.subbagian.nama,
    tanggalDokumen: record.tanggalDokumen,
    status: record.status,
    isDigital: record.isDigital,
    fileNama: record.fileNama,
    createdAt: record.createdAt,
  };
}

@Injectable()
export class ArsipService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryArsipDto): Promise<{
    items: ArsipDto[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;

    const where: Prisma.ArsipWhereInput = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.subbagianId ? { subbagianId: query.subbagianId } : {}),
      ...(query.search
        ? { judul: { contains: query.search, mode: Prisma.QueryMode.insensitive } }
        : {}),
    };

    const [records, total] = await this.prisma.$transaction([
      this.prisma.arsip.findMany({
        where,
        include: { subbagian: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.arsip.count({ where }),
    ]);

    return {
      items: records.map(toDto),
      total,
      page,
      pageSize,
    };
  }

  async findOne(id: number): Promise<ArsipDto> {
    const arsip = await this.prisma.arsip.findUnique({
      where: { id },
      include: { subbagian: true },
    });
    if (!arsip) {
      throw new NotFoundException(`Arsip dengan id ${id} tidak ditemukan`);
    }
    return toDto(arsip);
  }
}

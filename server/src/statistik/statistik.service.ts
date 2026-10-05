import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface StatistikDto {
  total: number;
  aktif: number;
  terverifikasi: number;
  digital: number;
  perSubbagian: { id: number; nama: string; jumlah: number }[];
}

@Injectable()
export class StatistikService {
  constructor(private readonly prisma: PrismaService) {}

  async get(): Promise<StatistikDto> {
    const aktifWhere = { deletedAt: null } as const;
    const [total, terverifikasi, digital, perSubbagian] = await this.prisma.$transaction([
      this.prisma.arsip.count({ where: aktifWhere }),
      this.prisma.arsip.count({ where: { ...aktifWhere, status: 'TERVERIFIKASI' } }),
      this.prisma.arsip.count({ where: { ...aktifWhere, isDigital: true } }),
      this.prisma.arsip.groupBy({
        by: ['subbagianId'],
        where: aktifWhere,
        _count: { _all: true },
        orderBy: { subbagianId: 'asc' } as never,
      }),
    ]);

    const namaBySubbagian = await this.prisma.subbagian.findMany();
    const namaMap = new Map(namaBySubbagian.map((s) => [s.id, s.nama]));

    const perSubbagianDto = (perSubbagian as { subbagianId: number; _count: { _all: number } }[])
      .map((row) => ({
        id: row.subbagianId,
        nama: namaMap.get(row.subbagianId) ?? `Subbagian ${row.subbagianId}`,
        jumlah: row._count._all,
      }))
      .sort((a, b) => a.id - b.id);

    // `aktif` = total — semua arsip dianggap aktif pada demo (tidak ada status arsip non-aktif).
    const aktif = total;

    return { total, aktif, terverifikasi, digital, perSubbagian: perSubbagianDto };
  }
}

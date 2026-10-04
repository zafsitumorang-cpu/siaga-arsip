import { Test } from '@nestjs/testing';
import { StatistikService } from '../src/statistik/statistik.service';
import { PrismaService } from '../src/prisma/prisma.service';

describe('StatistikService (unit)', () => {
  let service: StatistikService;
  const total = 80;
  const terverifikasi = 68;
  const digital = 61;
  const perSub = [
    { subbagianId: 1, _count: { _all: 22 } },
    { subbagianId: 2, _count: { _all: 20 } },
    { subbagianId: 3, _count: { _all: 19 } },
    { subbagianId: 4, _count: { _all: 19 } },
  ];

  const prisma = {
    arsip: {
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    subbagian: { findMany: jest.fn(async () => [{ id: 1, nama: 'A' }, { id: 2, nama: 'B' }, { id: 3, nama: 'C' }, { id: 4, nama: 'D' }]) },
    $transaction: jest.fn(async () => [total, terverifikasi, digital, perSub]),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [StatistikService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = moduleRef.get(StatistikService);
  });

  it('mengembalikan angka total/terverifikasi/digital dari prisma', async () => {
    const s = await service.get();
    expect(s.total).toBe(80);
    expect(s.terverifikasi).toBe(68);
    expect(s.digital).toBe(61);
  });

  it('aktif = total (semua arsip dianggap aktif pada demo)', async () => {
    const s = await service.get();
    expect(s.aktif).toBe(s.total);
  });

  it('perSubbagian berisi 4 entri dengan jumlah yang menjumlah ke total', async () => {
    const s = await service.get();
    expect(s.perSubbagian).toHaveLength(4);
    const sum = s.perSubbagian.reduce((a: number, b: { jumlah: number }) => a + b.jumlah, 0);
    expect(sum).toBe(s.total);
  });

  it('menggunakan satu $transaction', async () => {
    await service.get();
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
  });
});

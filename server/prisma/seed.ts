import { PrismaClient, StatusArsip } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SUBBAGIAN = [
  'Administrasi',
  'Hukum',
  'Pengawasan',
  'Penanganan Pelanggaran dan Penyelesaian Sengketa',
];

const JUDUL_TEMPLATES = [
  'Nota Dinas',
  'Surat Keputusan',
  'Laporan Kegiatan',
  'Proposal Program Kerja',
  'Berita Acara',
  'Surat Masuk',
  'Surat Keluar',
  'Dokumen Evaluasi',
  'Instruksi Direksi',
  'Laporan Monitoring',
];

// Simple deterministic PRNG (mulberry32) so seeds are reproducible.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

async function main() {
  const rand = mulberry32(42);

  // Admin user from env
  const username = process.env.ADMIN_USERNAME ?? 'admin';
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error('ADMIN_PASSWORD is required');
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash, role: 'ADMIN' },
  });

  // 4 subbagian
  for (const nama of SUBBAGIAN) {
    await prisma.subbagian.upsert({
      where: { nama },
      update: {},
      create: { nama },
    });
  }
  const subbagianList = await prisma.subbagian.findMany({
    where: { nama: { in: SUBBAGIAN } },
  });

  // 80 arsip (idempotent: skip if already seeded)
  const existing = await prisma.arsip.count();
  if (existing < 80) {
    const start = new Date('2025-09-01T00:00:00Z').getTime();
    const end = new Date('2025-10-31T23:59:59Z').getTime();
    const rows = Array.from({ length: 80 }, (_, i) => {
      const verifikasi = rand() < 0.85;
      const status: StatusArsip = verifikasi ? 'TERVERIFIKASI' : 'MENUNGGU';
      const isDigital = verifikasi && rand() < 0.9;
      const template = JUDUL_TEMPLATES[Math.floor(rand() * JUDUL_TEMPLATES.length)];
      const sub = subbagianList[Math.floor(rand() * subbagianList.length)];
      return {
        nomor: `${String(i + 1).padStart(3, '0')}/SIGA/2025`,
        judul: `${template} No. ${i + 1}`,
        subbagianId: sub.id,
        tanggalDokumen: new Date(start + rand() * (end - start)),
        status,
        isDigital,
        fileNama: isDigital ? `arsip-${i + 1}.pdf` : null,
        filePath: isDigital ? `/uploads/arsip-${i + 1}.pdf` : null,
      };
    });
    await prisma.arsip.createMany({ data: rows });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

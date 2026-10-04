# SIAGA ARSIP — Desain Demo/Prototipe

Tanggal: 2026-10-04
Status: Disetujui user (desain in-chat di-approve, lalu ditulis ke file ini)

## 1. Tujuan

Prototipe sistem informasi pengelolaan & digitalisasi arsip (dashboard mirip
dashboard Bawaslu Aceh Timur "SIAGA ARSIP") untuk keperluan demo. Bukan versi
produksi: tanpa multi-role granular, tanpa audit log, tanpa ekspor laporan.

## 2. Stack (final, disetujui user)

- Backend: NestJS + TypeScript + Prisma
- Database: PostgreSQL (Neon) — connection string via `.env`
- Frontend: React + Vite + Tailwind CSS + shadcn/ui
- Upload: NestJS FileInterceptor (Multer) + stream
- Auth: JWT (cookie httpOnly) + bcrypt
- Testing: Jest (unit) + supertest (e2e)

## 3. Struktur Monorepo

```
siaga-arsip/
├── server/          # NestJS + Prisma
│   ├── prisma/schema.prisma
│   ├── src/
│   │   ├── auth/    # login, jwt strategy, guard
│   │   ├── arsip/   # CRUD + upload + verifikasi
│   │   ├── statistik/ # agregasi dashboard
│   │   └── main.ts
│   └── uploads/     # file digital (pdf/jpg/png, max 10 MB)
└── web/             # React + Vite + Tailwind + shadcn/ui
    └── src/pages/   # Beranda, Arsip, UploadArsip, DetailArsip, Login
```

## 4. Skema Database (Prisma)

- `User`: id, username (unique), passwordHash, role ("ADMIN") — 1 akun seed
- `Subbagian`: id, nama (Administrasi, Hukum, Pengawasan, P3SP2S)
- `Arsip`: id, nomor, judul, subbagianId (FK), tanggalDokumen,
  status (enum: MENUNGGU / TERVERIFIKASI, default MENUNGGU),
  isDigital (bool), fileNama, filePath, createdAt

## 5. Halaman Frontend

1. **Beranda** — 4 kartu statistik (Total Arsip, Arsip Aktif, Terverifikasi,
   Arsip Digital), ringkasan per subbagian, tabel arsip terbaru.
2. **Daftar Arsip** — tabel + pencarian + filter subbagian & status + pagination.
3. **Upload Arsip** — form: judul, nomor, subbagian, tanggal, file (pdf/jpg/png).
4. **Detail Arsip** — metadata + pratinjau file + tombol Verifikasi.
5. **Login** — 1 halaman sederhana.

Tema: sidebar gelap, gaya dashboard admin, responsif.

## 6. API

- `POST /api/auth/login` — JWT httpOnly cookie; rate limit login
- `GET  /api/auth/me`
- `GET  /api/arsip` — query: search, subbagianId, status, page, pageSize
- `GET  /api/arsip/:id`
- `POST /api/arsip` — multipart upload (auth required), validasi tipe & ukuran
- `PATCH /api/arsip/:id/verifikasi` — ubah status ke TERVERIFIKASI (auth)
- `GET  /api/statistik` — agregasi dashboard (COUNT/GROUP BY)

Keamanan dasar: helmet, class-validator DTO, bcrypt (10 rounds), JWT expiry
(8 jam), rate limit endpoint login, file upload divalidasi (mime + ekstensi +
ukuran), nama file di-sanitize, path traversal dicegah.

## 7. Data Seed

- 4 subbagian.
- ±80 arsip dummy tersebar (status campur, tanggal Sep–Okt 2025).
- Angka statistik dashboard dihitung dari data nyata (bukan angka hardcode).
- 1 user admin seed (username/password di `.env`, tidak di-commit).

## 8. Testing (TDD)

- Unit: service statistik (agregasi benar), service verifikasi (transisi status).
- E2E: alur login → upload arsip → verifikasi → statistik berubah.

## 9. Di Luar Lingkup (YAGNI)

Multi-role granular, audit log, ekspor laporan PDF/Excel, klasifikasi kode
ANRI, reset password, notifikasi email, hosting produksi pemerintah.

## 10. Catatan Deployment

- Demo dijalankan lokal/server agent; Neon dipakai karena gratis & mudah.
- Untuk produksi pemerintahan nanti: migrasi ke infrastruktur milik instansi
  (data pemerintah tidak boleh di layanan pihak ketiga tanpa persetujuan).

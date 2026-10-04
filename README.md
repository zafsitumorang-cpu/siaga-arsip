# SIAGA ARSIP (Demo)

Prototipe sistem kearsipan: dashboard statistik, daftar arsip dengan pencarian/filter/pagination,
upload dokumen digital, dan verifikasi arsip. Monorepo pnpm berisi `server/` (NestJS + Prisma +
PostgreSQL) dan `web/` (React + Vite + Tailwind).

> ⚠️ **Ini demo, bukan untuk data arsip asli.** Password default ada di `.env`, tidak ada
> audit trail, dan file disimpan di disk lokal.

## Prasyarat

- Node.js 22+
- pnpm 10+
- PostgreSQL (mis. Neon) dengan koneksi string

## Setup

```bash
# 1. Install dependensi semua workspace
pnpm install

# 2. Isi server/.env
cp server/.env.example server/.env
#   DATABASE_URL=postgresql://...
#   JWT_SECRET=secret-acak-panjang
#   ADMIN_USERNAME=admin
#   ADMIN_PASSWORD=password-kuat

# 3. Migrasi + seed
cd server
pnpm prisma migrate deploy
pnpm prisma db seed

# 4. Jalankan backend + frontend
cd ..
pnpm dev
```

- Backend: http://localhost:3000 (prefix `/api`)
- Frontend: http://localhost:5173 (proxy `/api` → 3000)

Login dengan `ADMIN_USERNAME` / `ADMIN_PASSWORD` dari `server/.env`.

## Endpoint utama

- `POST /api/auth/login` — set cookie `access_token` (httpOnly)
- `GET /api/auth/me`
- `GET /api/arsip?search=&subbagianId=&status=&page=1&pageSize=10`
- `GET /api/arsip/:id`
- `POST /api/arsip` — multipart: `file`, `judul`, `nomor?`, `subbagianId`, `tanggalDokumen?`
- `PATCH /api/arsip/:id/verifikasi` — idempotent
- `GET /api/arsip/:id/file` — stream dokumen
- `GET /api/statistik` — `{ total, aktif, terverifikasi, digital, perSubbagian }`

## Batasan upload

- Tipe: `application/pdf`, `image/jpeg`, `image/png`
- Maks 10 MB
- File disimpan di `server/uploads/<uuid>.<ext>`

## Testing

```bash
cd server

# unit (mock Prisma)
pnpm test

# e2e — butuh DATABASE_URL yang sudah diseed
set -a && . ./.env && set +a
pnpm jest --config test/jest-e2e.json
```

## Catatan demo

- Semua angka statistik dihitung dari DB, tidak ada yang hardcode.
- `aktif` = total: pada demo tidak ada status arsip non-aktif.
- Verifikasi arsip yang sudah `TERVERIFIKASI` tetap 200 (bukan error).

# SIAGA ARSIP — Bawaslu Kabupaten Aceh Timur

Sistem Informasi Administrasi dan Digitalisasi Arsip berbasis web. Proyek ini menerjemahkan konsep **ARSIP TERPADU** menjadi aplikasi yang dapat digunakan untuk mengunggah, mengklasifikasikan, mencari, memverifikasi, melaporkan, dan mengendalikan arsip digital antar-subbagian.

## Fitur

- Dashboard responsif mengikuti referensi visual klien.
- Pencarian nomor, judul, dan kode klasifikasi.
- Filter subbagian dan status verifikasi.
- Unggah berkas ke object storage (maksimum 25 MB).
- Metadata arsip, tingkat kerahasiaan, dan retensi.
- Status: menunggu verifikasi, terverifikasi, ditolak, dan inaktif.
- Empat kelompok subbagian Bawaslu Aceh Timur.
- Klasifikasi dan jadwal retensi dummy yang siap diganti.
- Rekapitulasi dan ekspor CSV.
- Audit log untuk operasi penting.
- Autentikasi melalui akses privat ChatGPT Sites.
- Basis data D1 dan penyimpanan berkas R2.

## Teknologi

- Next.js 16 / React 19 melalui Vinext
- Cloudflare Workers
- Cloudflare D1 + Drizzle ORM
- Cloudflare R2
- TypeScript dan Tailwind CSS
- Lucide Icons

## Menjalankan secara lokal

Prasyarat: Node.js 22.13 atau lebih baru.

```bash
npm install
npm run db:generate
npm run build
```

Untuk pengembangan:

```bash
npm run dev
```

Terapkan migrasi lokal setelah build dengan perintah Wrangler yang dijelaskan dalam dokumentasi starter Vinext. Pada lingkungan produksi ChatGPT Sites, migrasi D1 dijalankan saat deployment.

## Struktur utama

```text
app/                    UI dan API routes
db/                     Skema serta akses D1
drizzle/                Migrasi basis data
lib/dummy-data.ts       Data demo terpusat
docs/                   PRD, arsitektur, data, dan deployment
.openai/hosting.json    Binding hosting, D1, dan R2
```

## Mengganti data dummy

1. Buka `lib/dummy-data.ts` untuk mengganti statistik, klasifikasi, dan contoh arsip.
2. Arsip yang diunggah melalui aplikasi disimpan sebagai data nyata di D1/R2.
3. Setelah data nyata tersedia, ubah statistik agregat dashboard agar dihitung penuh dari basis data.

Dokumentasi rinci tersedia di [docs/PRD.md](docs/PRD.md), [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), dan [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

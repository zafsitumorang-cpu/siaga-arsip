# Deployment dan Go-Live

## Lingkungan yang didukung

Deployment utama menggunakan ChatGPT Sites/Cloudflare Workers dengan binding `DB` (D1) dan `BUCKET` (R2) dari `.openai/hosting.json`.

## Checklist sebelum go-live

1. Tetapkan pemilik sistem, administrator, verifikator, dan operator tiap subbagian.
2. Finalisasi kode klasifikasi, retensi, SOP penamaan, dan batas kerahasiaan.
3. Ganti seluruh angka statistik dummy.
4. Impor metadata awal dan unggah berkas aktual.
5. Terapkan RBAC pada seluruh endpoint.
6. Uji backup/pemulihan D1 dan R2.
7. Uji keamanan, akses arsip rahasia, dan audit log.
8. Uji penerimaan pengguna pada desktop serta ponsel.
9. Sosialisasi SOP dan dokumentasikan hasil UAT.

## Perintah validasi

```bash
npm run db:generate
npm run build
npm run lint
```

## Rollback

Gunakan versi deployment sebelumnya untuk source/worker. Migrasi D1 bersifat maju dan tidak otomatis di-rollback; perubahan skema lanjutan harus menggunakan migrasi perbaikan. Berkas R2 dipertahankan ketika rollback source.

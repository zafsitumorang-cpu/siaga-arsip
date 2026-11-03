# Product Requirements Document (PRD)

## 1. Ringkasan

**Nama produk:** SIAGA ARSIP  
**Nama program perubahan:** ARSIP TERPADU  
**Pemilik proses:** Bawaslu Kabupaten Aceh Timur  
**Platform:** Web responsif, akses privat  
**Tujuan:** Memusatkan penataan, digitalisasi, pencarian, verifikasi, pengendalian, dan pelaporan arsip administrasi.

## 2. Masalah

Arsip fisik dan digital tersebar, nama berkas tidak seragam, pencarian lambat, terjadi duplikasi, hak akses belum terkendali, dan mekanisme backup belum baku. Kondisi ini menghambat pelayanan administrasi, monitoring, audit, serta penyediaan informasi bagi pimpinan.

## 3. Sasaran dan indikator

| Sasaran | Indikator awal |
|---|---|
| Temu kembali dokumen lebih cepat | 90% pencarian prioritas selesai kurang dari 60 detik |
| Metadata konsisten | 95% arsip baru memiliki nomor, klasifikasi, unit, tanggal, dan status |
| Pengendalian akses | Seluruh aksi tulis dilakukan oleh pengguna terautentikasi |
| Verifikasi | 90% arsip baru diverifikasi maksimal 2 hari kerja |
| Ketahanan data | Metadata dan berkas memiliki prosedur backup dan pemulihan |

## 4. Persona dan peran

| Peran | Kewenangan |
|---|---|
| Administrator | Seluruh arsip, pengguna, klasifikasi, laporan, dan pengaturan |
| Verifikator | Meninjau, menyetujui, menolak, serta memberi catatan |
| Operator | Mengunggah dan mengelola arsip pada subbagiannya |
| Viewer/Pimpinan | Membaca, mencari, mengunduh, dan melihat laporan |

Pada versi awal yang dipublikasikan, akses situs dilindungi autentikasi platform. Matriks peran sudah disiapkan pada skema `users` dan menjadi pekerjaan konfigurasi organisasi sebelum go-live penuh.

## 5. Ruang lingkup MVP

1. Dashboard statistik dan arsip terbaru.
2. Daftar arsip, pencarian, filter, dan pengelompokan subbagian.
3. Unggah berkas dan metadata.
4. Klasifikasi, tingkat kerahasiaan, serta jadwal retensi.
5. Status verifikasi.
6. Unduh berkas aktual.
7. Laporan dan ekspor CSV.
8. Profil pengguna, pengaturan, dan audit log.
9. Tampilan desktop/mobile yang mengikuti referensi klien.

## 6. Alur utama

### Unggah

Operator mengisi nomor, judul, tanggal, subbagian, klasifikasi, kerahasiaan, deskripsi, dan berkas. Sistem memvalidasi isian serta ukuran, menyimpan berkas di R2, metadata di D1, lalu menetapkan status `Menunggu Verifikasi`.

### Verifikasi

Verifikator membuka daftar antrean, memeriksa metadata/berkas, lalu menyetujui atau menolak disertai catatan. Sistem merekam pengguna dan waktu keputusan.

### Pencarian

Pengguna dapat mencari berdasarkan judul, nomor, atau kode klasifikasi serta memfilter berdasarkan subbagian dan status.

## 7. Aturan bisnis

- Nomor arsip wajib dan unik.
- Judul, tanggal, subbagian, klasifikasi, kerahasiaan, dan berkas wajib.
- Ukuran berkas maksimum 25 MB.
- Format awal: PDF, DOC/DOCX, XLS/XLSX, JPG/JPEG, dan PNG.
- Arsip rahasia hanya boleh dibuka oleh pengguna berwenang pada pengembangan tahap berikutnya.
- Penghapusan berkas harus menghapus object storage dan metadata serta direkam pada audit log.
- Perubahan skema harus melalui migrasi, bukan pembuatan tabel saat request.

## 8. Di luar MVP

- OCR otomatis dan pencarian isi PDF.
- Tanda tangan elektronik.
- Integrasi SRIKANDI atau sistem eksternal.
- Notifikasi email/WhatsApp.
- Pemusnahan otomatis berdasarkan retensi.
- Antivirus berkas terkelola.

## 9. Acceptance criteria

- Semua halaman utama tampil tanpa overflow pada desktop dan mobile.
- Data dummy tersedia ketika basis data masih kosong.
- Pengguna terautentikasi dapat mengunggah dokumen valid.
- Berkas tersimpan pada R2 dan metadata pada D1.
- Pencarian/filter menghasilkan daftar yang benar.
- Laporan CSV dapat diunduh.
- Build produksi dan migrasi berhasil.

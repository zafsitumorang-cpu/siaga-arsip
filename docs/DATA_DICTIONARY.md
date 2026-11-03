# Kamus Data

## archives

Menyimpan metadata dokumen: ID, nomor unik, judul, deskripsi, subbagian, kode klasifikasi, tanggal arsip, status, tingkat kerahasiaan, nama/key/ukuran/MIME berkas, pengunggah, waktu unggah, verifikator, waktu verifikasi, dan catatan.

## users

Menyimpan identitas internal aplikasi, email tampilan, nama, peran (`admin`, `verifikator`, `operator`, `viewer`), subbagian, status aktif, dan waktu pembuatan.

## classifications

Menyimpan kode unik, nama klasifikasi, retensi dalam tahun, deskripsi, dan waktu pembuatan.

## audit_logs

Menyimpan pengguna, aksi, jenis entitas, ID entitas, rincian, dan timestamp. Tabel ini bersifat append-oriented dan sebaiknya tidak dapat dihapus oleh operator biasa.

## Subbagian baku

- Administrasi
- Hukum
- Pengawasan
- Penanganan Pelanggaran

Label panjang pada UI dapat menampilkan “Penanganan Pelanggaran dan Penyelesaian Sengketa”.

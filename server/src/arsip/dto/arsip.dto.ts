export interface ArsipDto {
  id: number;
  nomor: string | null;
  judul: string;
  subbagianId: number;
  subbagianNama: string;
  tanggalDokumen: Date | null;
  status: 'MENUNGGU' | 'TERVERIFIKASI';
  isDigital: boolean;
  fileNama: string | null;
  createdAt: Date;
  verifiedAt: Date | null;
  verifiedByUsername: string | null;
}

interface ArsipWithSubbagian {
  id: number;
  nomor: string | null;
  judul: string;
  subbagianId: number;
  subbagian: { nama: string };
  tanggalDokumen: Date | null;
  status: 'MENUNGGU' | 'TERVERIFIKASI';
  isDigital: boolean;
  fileNama: string | null;
  createdAt: Date;
  verifiedAt?: Date | null;
  verifiedBy?: { username: string } | null;
}

export function toArsipDto(record: ArsipWithSubbagian): ArsipDto {
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
    verifiedAt: record.verifiedAt ?? null,
    verifiedByUsername: record.verifiedBy?.username ?? null,
  };
}

export interface RiwayatDto {
  id: number;
  aksi: string;
  keterangan: string | null;
  username: string | null;
  createdAt: Date;
}

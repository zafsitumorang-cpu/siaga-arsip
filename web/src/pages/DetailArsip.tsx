import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { api, ApiError } from '../lib/api';
import { StatusBadge } from '../components/StatCard';
import { useToast } from '../components/Toast';
import { PageLoading } from '../components/Loading';

interface ArsipDetail {
  id: number;
  nomor: string | null;
  judul: string;
  subbagianNama: string;
  tanggalDokumen: string | null;
  status: 'MENUNGGU' | 'TERVERIFIKASI';
  isDigital: boolean;
  fileNama: string | null;
  createdAt: string;
  verifiedAt: string | null;
  verifiedByUsername: string | null;
}

interface RiwayatItem {
  id: number;
  aksi: string;
  keterangan: string | null;
  username: string | null;
  createdAt: string;
}

function formatWaktu(iso: string): string {
  return new Date(iso).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function DetailArsip() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [arsip, setArsip] = useState<ArsipDetail | null>(null);
  const [riwayat, setRiwayat] = useState<RiwayatItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(() => {
    api
      .get(`/api/arsip/${id}`)
      .then((d) => setArsip(d as ArsipDetail))
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.status === 404) setError('Arsip tidak ditemukan');
        else setError('Gagal memuat arsip');
      });
    api
      .get(`/api/arsip/${id}/riwayat`)
      .then((d) => setRiwayat(d as RiwayatItem[]))
      .catch(() => undefined); // riwayat gagal tidak boleh merusak halaman detail
  }, [id]);

  useEffect(load, [load]);

  async function verifikasi() {
    setVerifying(true);
    try {
      await api.patch(`/api/arsip/${id}/verifikasi`);
      load();
      toast('success', 'Arsip berhasil diverifikasi.');
    } catch {
      setError('Gagal memverifikasi arsip');
      toast('error', 'Gagal memverifikasi arsip.');
    } finally {
      setVerifying(false);
    }
  }

  async function hapusArsip() {
    setDeleting(true);
    try {
      await api.delete(`/api/arsip/${id}`);
      toast('success', 'Arsip dihapus. Data tetap tersimpan untuk audit.');
      navigate('/arsip');
    } catch {
      toast('error', 'Gagal menghapus arsip.');
      setDeleting(false);
    }
  }

  if (error) {
    return (
      <div className="space-y-3">
        <p className="text-red-600">{error}</p>
        <Link to="/arsip" className="text-sm text-blue-600 hover:underline">
          ← Kembali ke daftar
        </Link>
      </div>
    );
  }

  if (!arsip) {
    return <PageLoading text="Memuat arsip…" />;
  }

  return (
    <div className="max-w-xl space-y-4">
      <Link to="/arsip" className="text-sm text-blue-600 hover:underline">
        ← Kembali ke daftar
      </Link>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-start justify-between">
          <h1 className="text-xl font-bold text-slate-800">{arsip.judul}</h1>
          <StatusBadge status={arsip.status} />
        </div>

        <dl className="space-y-2 text-sm">
          <div className="flex">
            <dt className="w-40 text-slate-500">Nomor</dt>
            <dd className="text-slate-800">
              {arsip.nomor ? (
                <span className="font-mono">{arsip.nomor}</span>
              ) : (
                <span className="italic text-slate-400">Belum ada nomor arsip</span>
              )}
            </dd>
          </div>
          <div className="flex">
            <dt className="w-40 text-slate-500">Subbagian</dt>
            <dd className="text-slate-800">{arsip.subbagianNama}</dd>
          </div>
          <div className="flex">
            <dt className="w-40 text-slate-500">Tanggal Dokumen</dt>
            <dd className="text-slate-800">
              {arsip.tanggalDokumen ? (
                new Date(arsip.tanggalDokumen).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              ) : (
                <span className="italic text-slate-400">Belum diisi tanggal dokumen</span>
              )}
            </dd>
          </div>
          <div className="flex">
            <dt className="w-40 text-slate-500">File</dt>
            <dd className="text-slate-800">
              {arsip.isDigital && arsip.fileNama ? (
                <a
                  href={`/api/arsip/${arsip.id}/file`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Buka Dokumen ({arsip.fileNama})
                </a>
              ) : (
                <span className="italic text-slate-400">Arsip fisik (belum digital)</span>
              )}
            </dd>
          </div>
        </dl>

        {arsip.status === 'MENUNGGU' && (
          <button
            onClick={verifikasi}
            disabled={verifying}
            className="mt-5 rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {verifying ? 'Memverifikasi…' : 'Verifikasi'}
          </button>
        )}

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={() => {
              setDeleteConfirmText('');
              setShowDeleteDialog(true);
            }}
            className="flex items-center gap-1.5 rounded border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <Trash2 size={15} /> Hapus Arsip
          </button>
          <span className="text-xs text-slate-400">
            Arsip disembunyikan, data tetap tersimpan untuk audit.
          </span>
        </div>

        {arsip.status === 'TERVERIFIKASI' && arsip.verifiedAt && (
          <div className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            Diverifikasi oleh{' '}
            <span className="font-semibold">{arsip.verifiedByUsername ?? 'sistem'}</span> pada{' '}
            {formatWaktu(arsip.verifiedAt)}
          </div>
        )}
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Riwayat Arsip
        </h2>
        {riwayat.length === 0 ? (
          <p className="text-sm italic text-slate-400">
            Belum ada riwayat tercatat (arsip sebelum fitur jejak audit).
          </p>
        ) : (
          <ol className="relative space-y-4 border-l border-slate-200 pl-5">
            {riwayat.map((r) => (
              <li key={r.id} className="relative">
                <span
                  className={`absolute -left-[26px] top-1 h-3 w-3 rounded-full border-2 border-white ${
                    r.aksi === 'DIVERIFIKASI' ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                />
                <p className="text-sm font-medium text-slate-800">
                  {r.aksi === 'DIBUAT' ? 'Arsip dibuat / diunggah' : 'Diverifikasi'}
                  {r.username && (
                    <span className="font-normal text-slate-500"> — {r.username}</span>
                  )}
                </p>
                <p className="text-xs text-slate-400">{formatWaktu(r.createdAt)}</p>
              </li>
            ))}
          </ol>
        )}
      </div>

      {showDeleteDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          onClick={() => !deleting && setShowDeleteDialog(false)}
        >
          <div
            className="animate-pop w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-slate-800">Hapus arsip ini?</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Arsip{' '}
              <span className="font-semibold text-slate-800">“{arsip.judul}”</span> akan
              disembunyikan dari semua daftar. Datanya{' '}
              <span className="font-semibold">tetap tersimpan</span> dan bisa dipulihkan,
              serta tindakan ini tercatat di riwayat audit.
            </p>
            <p className="mt-3 text-sm text-slate-600">
              Ketik <span className="font-mono font-semibold text-red-600">HAPUS</span> untuk
              konfirmasi:
            </p>
            <input
              autoFocus
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
              placeholder="HAPUS"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteDialog(false)}
                disabled={deleting}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={hapusArsip}
                disabled={deleteConfirmText !== 'HAPUS' || deleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {deleting ? 'Menghapus…' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

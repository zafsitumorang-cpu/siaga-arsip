import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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
}

export default function DetailArsip() {
  const { id } = useParams();
  const toast = useToast();
  const [arsip, setArsip] = useState<ArsipDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  const load = useCallback(() => {
    api
      .get(`/api/arsip/${id}`)
      .then((d) => setArsip(d as ArsipDetail))
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.status === 404) setError('Arsip tidak ditemukan');
        else setError('Gagal memuat arsip');
      });
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
            <dd className="text-slate-800">{arsip.nomor ?? '—'}</dd>
          </div>
          <div className="flex">
            <dt className="w-40 text-slate-500">Subbagian</dt>
            <dd className="text-slate-800">{arsip.subbagianNama}</dd>
          </div>
          <div className="flex">
            <dt className="w-40 text-slate-500">Tanggal Dokumen</dt>
            <dd className="text-slate-800">
              {arsip.tanggalDokumen
                ? new Date(arsip.tanggalDokumen).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : '—'}
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
                '—'
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
      </div>
    </div>
  );
}

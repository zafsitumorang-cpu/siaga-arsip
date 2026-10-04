import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

interface Statistik {
  total: number;
  aktif: number;
  terverifikasi: number;
  digital: number;
  perSubbagian: { id: number; nama: string; jumlah: number }[];
}

interface ArsipItem {
  id: number;
  judul: string;
  nomor: string | null;
  subbagianNama: string;
  status: 'MENUNGGU' | 'TERVERIFIKASI';
  createdAt: string;
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-sm">
      <div className="text-2xl font-bold text-slate-800">{value}</div>
      <div className="mt-1 text-sm text-slate-500">{label}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === 'TERVERIFIKASI'
      ? 'bg-green-100 text-green-700'
      : 'bg-yellow-100 text-yellow-700';
  const label = status === 'TERVERIFIKASI' ? 'Terverifikasi' : 'Menunggu Verifikasi';
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}

export default function Beranda() {
  const [statistik, setStatistik] = useState<Statistik | null>(null);
  const [terbaru, setTerbaru] = useState<ArsipItem[]>([]);

  useEffect(() => {
    api.get('/api/statistik').then((d) => setStatistik(d as Statistik));
    api.get('/api/arsip?pageSize=10').then((d) => {
      setTerbaru((d as { items: ArsipItem[] }).items);
    });
  }, []);

  if (!statistik) {
    return <p className="text-slate-500">Memuat statistik…</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-800">Beranda</h1>

      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Arsip" value={statistik.total} />
        <StatCard label="Arsip Aktif" value={statistik.aktif} />
        <StatCard label="Arsip Terverifikasi" value={statistik.terverifikasi} />
        <StatCard label="Arsip Digital" value={statistik.digital} />
      </div>

      <section className="rounded-lg bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-slate-800">Arsip per Subbagian</h2>
        <ul className="space-y-2">
          {statistik.perSubbagian.map((s) => (
            <li key={s.id} className="flex items-center justify-between border-b pb-2 last:border-0">
              <span className="text-sm text-slate-700">{s.nama}</span>
              <span className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-800">{s.jumlah}</span>
                <Link
                  to={`/arsip?subbagianId=${s.id}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Lihat Arsip
                </Link>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-slate-800">Arsip Terbaru</h2>
        <table className="w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="pb-2">Judul</th>
              <th className="pb-2">Nomor</th>
              <th className="pb-2">Subbagian</th>
              <th className="pb-2">Tanggal</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {terbaru.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="py-2">
                  <Link to={`/arsip/${a.id}`} className="text-blue-600 hover:underline">
                    {a.judul}
                  </Link>
                </td>
                <td className="py-2">{a.nomor ?? '—'}</td>
                <td className="py-2">{a.subbagianNama}</td>
                <td className="py-2">
                  {new Date(a.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td className="py-2">
                  <StatusBadge status={a.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export { StatCard, StatusBadge };

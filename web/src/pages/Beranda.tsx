import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import {
  ArrowRight,
  BarChart3,
  Cloud,
  FileUp,
  FolderKanban,
  FolderOpen,
  FileCheck2,
  Scale,
  Search,
  ShieldAlert,
  Users,
  UploadCloud,
  ListChecks,
  FolderTree,
} from 'lucide-react';
import { api } from '../lib/api';
import { StatCard, StatusBadge } from '../components/StatCard';

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

const subbagianStyle: Record<number, { tile: string; btn: string; icon: typeof FolderKanban }> = {
  1: { tile: 'bg-orange-50 text-orange-600', btn: 'bg-orange-500 hover:bg-orange-600', icon: FolderKanban },
  2: { tile: 'bg-blue-50 text-blue-600', btn: 'bg-blue-600 hover:bg-blue-700', icon: Scale },
  3: { tile: 'bg-green-50 text-green-600', btn: 'bg-green-600 hover:bg-green-700', icon: ShieldAlert },
  4: { tile: 'bg-purple-50 text-purple-600', btn: 'bg-purple-600 hover:bg-purple-700', icon: Users },
};

function formatNumber(n: number) {
  return n.toLocaleString('id-ID');
}

const quickActions = [
  { to: '/arsip', label: 'Pencarian Arsip', icon: Search, color: 'bg-blue-50 text-blue-600' },
  { to: '/upload', label: 'Unggah Arsip', icon: FileUp, color: 'bg-green-50 text-green-600' },
  { to: '/laporan', label: 'Rekapitulasi Arsip', icon: ListChecks, color: 'bg-orange-50 text-orange-600' },
  { to: '/laporan', label: 'Laporan Arsip', icon: BarChart3, color: 'bg-purple-50 text-purple-600' },
  { to: '/arsip', label: 'Klasifikasi Arsip', icon: FolderTree, color: 'bg-red-50 text-red-600' },
];

export default function Beranda() {
  const [statistik, setStatistik] = useState<Statistik | null>(null);
  const [terbaru, setTerbaru] = useState<ArsipItem[]>([]);
  const [animateTable] = useAutoAnimate();

  useEffect(() => {
    api.get('/api/statistik').then((d) => setStatistik(d as Statistik));
    api.get('/api/arsip?pageSize=5').then((d) => {
      setTerbaru((d as { items: ArsipItem[] }).items);
    });
  }, []);

  if (!statistik) {
    return <p className="text-slate-500">Memuat statistik…</p>;
  }

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <section className="relative animate-fade-up overflow-hidden rounded-2xl bg-gradient-to-r from-sky-100 via-sky-50 to-white p-8 shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-2xl font-extrabold text-slate-800">
            Selamat Datang di{' '}
            <span className="text-sky-700">
              SIAGA <span className="text-red-600">ARSIP</span>
            </span>
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Arsip yang tertata, informasi yang akurat, untuk pengawasan pemilu yang lebih baik.
            Kelola, verifikasi, dan digitalisasi arsip Bawaslu Kabupaten Aceh Timur dalam satu
            sistem.
          </p>
          <Link
            to="/upload"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow transition-colors hover:bg-red-700"
          >
            <UploadCloud size={16} />
            Unggah Arsip
          </Link>
        </div>
        <FolderOpen
          className="pointer-events-none absolute -right-6 -top-6 h-56 w-56 text-sky-200/70"
          strokeWidth={1}
        />
      </section>

      {/* Stat cards */}
      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        style={{ animationDelay: '60ms' }}
      >
        <div className="animate-fade-up" style={{ animationDelay: '80ms' }}>
          <StatCard tone="red" icon={FolderOpen} label="Total Arsip" value={formatNumber(statistik.total)} />
        </div>
        <div className="animate-fade-up" style={{ animationDelay: '160ms' }}>
          <StatCard tone="blue" icon={FolderOpen} label="Arsip Aktif" value={formatNumber(statistik.aktif)} />
        </div>
        <div className="animate-fade-up" style={{ animationDelay: '240ms' }}>
          <StatCard tone="green" icon={FileCheck2} label="Terverifikasi" value={formatNumber(statistik.terverifikasi)} />
        </div>
        <div className="animate-fade-up" style={{ animationDelay: '320ms' }}>
          <StatCard tone="purple" icon={Cloud} label="Arsip Digital" value={formatNumber(statistik.digital)} />
        </div>
      </div>

      {/* Arsip per Subbagian */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-slate-800">Arsip Berdasarkan Subbagian</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statistik.perSubbagian.map((s) => {
            const st = subbagianStyle[s.id] ?? subbagianStyle[1];
            const Icon = st.icon;
            return (
              <div
                key={s.id}
                className="hover-lift relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <Icon
                  className="pointer-events-none absolute -bottom-4 -right-4 h-24 w-24 opacity-10"
                  strokeWidth={1.2}
                />
                <div className="relative z-10 flex flex-1 flex-col">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${st.tile}`}>
                    <Icon size={22} />
                  </div>
                  <h3
                    title={s.nama}
                    className="mt-3 font-semibold leading-snug text-slate-800 line-clamp-2"
                  >
                    {s.nama}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">Kelola arsip subbagian ini</p>
                  <div className="mt-auto pt-2">
                    <span className="inline-block w-max rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {formatNumber(s.jumlah)} Dokumen
                    </span>
                    <Link
                      to={`/arsip?subbagianId=${s.id}`}
                      className={`mt-3 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white transition-colors ${st.btn}`}
                    >
                      Lihat Arsip
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Arsip Terbaru */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-slate-800">Arsip Terbaru</h2>
            <Link to="/arsip" className="text-sm font-medium text-blue-600 hover:underline">
              Lihat Semua →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="pb-2 font-medium">Judul Arsip</th>
                  <th className="pb-2 font-medium">Subbagian</th>
                  <th className="pb-2 font-medium">Tanggal Upload</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody ref={animateTable}>
                {terbaru.map((a) => (
                  <tr key={a.id} className="border-t border-slate-100">
                    <td className="py-2.5">
                      <Link to={`/arsip/${a.id}`} className="font-medium text-slate-700 hover:text-blue-600">
                        {a.judul}
                      </Link>
                    </td>
                    <td className="py-2.5">{a.subbagianNama}</td>
                    <td className="py-2.5 text-slate-500">
                      {new Date(a.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-2.5">
                      <StatusBadge status={a.status} />
                    </td>
                  </tr>
                ))}
                {terbaru.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-slate-400">
                      Belum ada arsip
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Akses Cepat */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-bold text-slate-800">Akses Cepat</h2>
          <ul className="space-y-1">
            {quickActions.map(({ to, label, icon: Icon, color }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-slate-50"
                >
                  <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
                    <Icon size={17} />
                  </span>
                  <span className="flex-1 text-sm font-medium text-slate-700">{label}</span>
                  <ArrowRight size={14} className="text-slate-400" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-xl bg-sky-50 p-4">
            <p className="text-xs font-semibold text-sky-800">Digitalisasi Arsip</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Untuk pelayanan publik yang lebih baik — bersama mengawal demokrasi.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export { StatCard, StatusBadge };

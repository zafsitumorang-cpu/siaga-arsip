import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { api } from '../lib/api';
import { StatCard } from '../components/StatCard';
import { FolderOpen, FileCheck2, Cloud } from 'lucide-react';

interface Statistik {
  total: number;
  aktif: number;
  terverifikasi: number;
  digital: number;
  perSubbagian: { id: number; nama: string; jumlah: number }[];
}

const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#7c3aed', '#0891b2'];

export default function Laporan() {
  const [statistik, setStatistik] = useState<Statistik | null>(null);

  useEffect(() => {
    api.get('/api/statistik').then((d) => setStatistik(d as Statistik));
  }, []);

  if (!statistik) {
    return <p className="text-slate-500">Memuat laporan…</p>;
  }

  const statusData = [
    { name: 'Terverifikasi', value: statistik.terverifikasi },
    { name: 'Menunggu', value: statistik.total - statistik.terverifikasi },
  ];

  const digitalData = [
    { name: 'Digital', value: statistik.digital },
    { name: 'Non-digital', value: statistik.total - statistik.digital },
  ];

  const subbagianData = statistik.perSubbagian.map((s) => ({
    nama: s.nama.length > 18 ? `${s.nama.slice(0, 17)}…` : s.nama,
    jumlah: s.jumlah,
  }));

  const persenVerifikasi =
    statistik.total === 0 ? 0 : Math.round((statistik.terverifikasi / statistik.total) * 100);
  const persenDigital =
    statistik.total === 0 ? 0 : Math.round((statistik.digital / statistik.total) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h1 className="text-xl font-bold text-slate-800">Laporan</h1>
        <span className="text-sm text-slate-500">
          Dicetak: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard tone="red" icon={FolderOpen} label="Total Arsip" value={statistik.total} />
        <StatCard tone="green" icon={FileCheck2} label="Terverifikasi" value={`${statistik.terverifikasi} (${persenVerifikasi}%)`} />
        <StatCard tone="blue" icon={FolderOpen} label="Menunggu Verifikasi" value={statistik.total - statistik.terverifikasi} />
        <StatCard tone="purple" icon={Cloud} label="Arsip Digital" value={`${statistik.digital} (${persenDigital}%)`} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <section className="rounded-lg bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-semibold text-slate-800">Arsip per Subbagian</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={subbagianData} margin={{ top: 4, right: 8, bottom: 40, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="nama" angle={-25} textAnchor="end" interval={0} fontSize={11} />
              <YAxis allowDecimals={false} fontSize={11} />
              <Tooltip />
              <Bar dataKey="jumlah" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="rounded-lg bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-semibold text-slate-800">Komposisi Status</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={(entry: any) => `${entry.name}: ${entry.value}`}
              >
                {statusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </section>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <section className="rounded-lg bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-semibold text-slate-800">Arsip Digital vs Non-digital</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={digitalData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={85}
                label={(entry: any) => `${entry.name}: ${entry.value}`}
              >
                {digitalData.map((_, i) => (
                  <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </section>

        <section className="rounded-lg bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-semibold text-slate-800">Rekapitulasi</h2>
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="pb-2">Subbagian</th>
                <th className="pb-2 text-right">Jumlah</th>
                <th className="pb-2 text-right">% dari Total</th>
              </tr>
            </thead>
            <tbody>
              {statistik.perSubbagian.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="py-2">{s.nama}</td>
                  <td className="py-2 text-right">{s.jumlah}</td>
                  <td className="py-2 text-right">
                    {statistik.total === 0 ? 0 : Math.round((s.jumlah / statistik.total) * 100)}%
                  </td>
                </tr>
              ))}
              <tr className="border-t font-semibold">
                <td className="py-2">Total</td>
                <td className="py-2 text-right">{statistik.total}</td>
                <td className="py-2 text-right">100%</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

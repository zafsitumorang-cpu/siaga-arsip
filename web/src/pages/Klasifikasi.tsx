import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, Scale, ShieldAlert, Users, FolderOpen } from 'lucide-react';
import { api } from '../lib/api';

interface Statistik {
  total: number;
  perSubbagian: { id: number; nama: string; jumlah: number }[];
}

interface ArsipItem {
  id: number;
  judul: string;
  nomor: string | null;
  subbagianId: number;
}

const subbagianMeta: Record<
  number,
  { tile: string; icon: typeof FolderKanban; desc: string }
> = {
  1: {
    tile: 'bg-orange-50 text-orange-600',
    icon: FolderKanban,
    desc: 'Arsip surat menyurat, kepegawaian, perencanaan, keuangan, dan umum.',
  },
  2: {
    tile: 'bg-blue-50 text-blue-600',
    icon: Scale,
    desc: 'Arsip produk hukum, dokumentasi hukum, dan konsultasi hukum.',
  },
  3: {
    tile: 'bg-green-50 text-green-600',
    icon: ShieldAlert,
    desc: 'Arsip hasil pengawasan, rekomendasi, dan tindak lanjut.',
  },
  4: {
    tile: 'bg-purple-50 text-purple-600',
    icon: Users,
    desc: 'Arsip laporan, kajian, keputusan, dan dokumen penyelesaian sengketa.',
  },
};

export default function Klasifikasi() {
  const [statistik, setStatistik] = useState<Statistik | null>(null);
  const [arsip, setArsip] = useState<ArsipItem[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    api.get('/api/statistik').then((d) => setStatistik(d as Statistik));
    api.get('/api/arsip?pageSize=100').then((d) =>
      setArsip((d as { items: ArsipItem[] }).items),
    );
  }, []);

  const filtered = useMemo(
    () => (selected === null ? arsip : arsip.filter((a) => a.subbagianId === selected)),
    [arsip, selected],
  );

  if (!statistik) {
    return <p className="text-slate-500">Memuat klasifikasi…</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Klasifikasi Arsip</h1>
        <p className="mt-1 text-sm text-slate-500">
          Klasifikasi arsip berdasarkan subbagian — pilih subbagian untuk melihat daftar arsipnya.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statistik.perSubbagian.map((s) => {
          const meta = subbagianMeta[s.id] ?? subbagianMeta[1];
          const Icon = meta.icon;
          const active = selected === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSelected(active ? null : s.id)}
              className={`flex flex-col rounded-xl border bg-white p-5 text-left shadow-sm transition-all ${
                active
                  ? 'border-red-400 ring-2 ring-red-200'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${meta.tile}`}>
                <Icon size={22} />
              </div>
              <h3
                title={s.nama}
                className="mt-3 font-semibold leading-snug text-slate-800 line-clamp-2"
              >
                {s.nama}
              </h3>
              <p title={meta.desc} className="mt-1 line-clamp-2 text-xs text-slate-500">
                {meta.desc}
              </p>
              <span className="mt-auto inline-block w-max rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {s.jumlah.toLocaleString('id-ID')} Dokumen
              </span>
            </button>
          );
        })}
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-bold text-slate-800">
            <FolderOpen size={18} className="text-slate-400" />
            {selected === null
              ? 'Semua Arsip (100 terbaru)'
              : `Arsip ${statistik.perSubbagian.find((s) => s.id === selected)?.nama ?? ''}`}
          </h2>
          {selected !== null && (
            <button
              onClick={() => setSelected(null)}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Tampilkan semua
            </button>
          )}
        </div>
        <ul className="divide-y divide-slate-100">
          {filtered.map((a) => (
            <li key={a.id} className="py-2.5">
              <Link to={`/arsip/${a.id}`} className="group flex items-center justify-between">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-slate-700 group-hover:text-blue-600">
                    {a.judul}
                  </span>
                  {a.nomor && (
                    <span className="block text-xs text-slate-400">No. {a.nomor}</span>
                  )}
                </span>
                <span className="ml-3 shrink-0 text-xs text-slate-400">
                  {arsip.find((x) => x.id === a.id)?.subbagianId === a.subbagianId
                    ? statistik.perSubbagian.find((s) => s.id === a.subbagianId)?.nama
                    : ''}
                </span>
              </Link>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="py-6 text-center text-sm text-slate-400">Tidak ada arsip.</li>
          )}
        </ul>
      </section>
    </div>
  );
}

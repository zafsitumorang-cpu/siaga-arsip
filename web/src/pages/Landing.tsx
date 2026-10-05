import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderOpen,
  FileCheck2,
  Cloud,
  ShieldCheck,
  Search,
  Upload,
  BarChart3,
  ArrowRight,
  Landmark,
  Database,
  Lock,
  Zap,
  CheckCircle2,
} from 'lucide-react';

interface Statistik {
  total: number;
  terverifikasi: number;
  digital: number;
}

function useCountUp(target: number | null, duration = 1200): number {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    if (target === null) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);
  return value;
}

function StatCard({ icon: Icon, value, label, tone, delay }: {
  icon: typeof FolderOpen;
  value: number | null;
  label: string;
  tone: string;
  delay: number;
}) {
  const n = useCountUp(value);
  return (
    <div
      className="animate-fade-up rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`mb-3 inline-flex rounded-xl p-2.5 ${tone}`}>
        <Icon size={22} />
      </div>
      <p className="text-3xl font-extrabold text-white tabular-nums">{n}</p>
      <p className="mt-1 text-sm text-slate-400">{label}</p>
    </div>
  );
}

const fitur = [
  {
    icon: Upload,
    title: 'Upload & Digitalisasi',
    desc: 'Unggah dokumen arsip dengan validasi otomatis, tersimpan aman dan dapat diakses kapan saja.',
  },
  {
    icon: ShieldCheck,
    title: 'Verifikasi Berjenjang',
    desc: 'Setiap arsip melewati proses verifikasi untuk menjamin keabsahan dan keakuratan data.',
  },
  {
    icon: Search,
    title: 'Pencarian Cepat',
    desc: 'Temukan arsip berdasarkan judul maupun nomor arsip dalam hitungan detik.',
  },
  {
    icon: BarChart3,
    title: 'Laporan & Statistik',
    desc: 'Rekapitulasi arsip per subbagian dengan grafik interaktif untuk pengambilan keputusan.',
  },
];

const keunggulan = [
  { icon: Lock, text: 'Akses terbatas — hanya personel berwenang' },
  { icon: Database, text: 'Database cloud terlindungi (TLS)' },
  { icon: Zap, text: 'Ringan & responsif di semua perangkat' },
];

export default function Landing() {
  const [stat, setStat] = useState<Statistik | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/statistik/publik')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setStat(d as Statistik))
      .catch(() => setError(true));
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex shrink-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-600 font-black text-white">SA</span>
            <span className="text-base font-bold sm:text-lg">
              SIAGA <span className="text-red-500">ARSIP</span>
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <a href="#fitur" className="hidden text-sm text-slate-300 transition-colors hover:text-white sm:block">Fitur</a>
            <a href="#statistik" className="hidden text-sm text-slate-300 transition-colors hover:text-white sm:block">Statistik</a>
            <Link
              to="/login"
              className="whitespace-nowrap rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition-all hover:bg-red-500 active:scale-95 sm:px-4"
            >
              Masuk
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="relative overflow-hidden">
        {/* glow dekoratif */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-red-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute top-40 right-0 h-[300px] w-[400px] rounded-full bg-sky-600/10 blur-[100px]" />

        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-20 text-center">
          <div className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-sm text-red-400">
            <Landmark size={15} />
            Bawaslu Kabupaten Aceh Timur
          </div>
          <h1 className="animate-fade-up mx-auto max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-6xl" style={{ animationDelay: '100ms' }}>
            Arsip Tertata,{' '}
            <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
              Kinerja Meningkat
            </span>
          </h1>
          <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-lg text-slate-400" style={{ animationDelay: '200ms' }}>
            Sistem administrasi &amp; digitalisasi arsip untuk pengawasan pemilu yang lebih baik.
            Kelola, verifikasi, dan digitalisasi seluruh arsip Bawaslu Aceh Timur dalam satu platform.
          </p>
          <div className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row" style={{ animationDelay: '300ms' }}>
            <Link
              to="/login"
              className="group inline-flex items-center gap-2 rounded-xl bg-red-600 px-7 py-3.5 font-semibold text-white shadow-xl shadow-red-600/30 transition-all hover:bg-red-500 hover:shadow-red-500/40 active:scale-95"
            >
              Masuk Aplikasi
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#fitur"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-7 py-3.5 font-semibold text-slate-200 transition-colors hover:border-white/30 hover:bg-white/5"
            >
              Pelajari Fitur
            </a>
          </div>
        </div>
      </header>

      {/* STATISTIK LIVE */}
      <section id="statistik" className="relative mx-auto -mt-10 max-w-5xl px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard icon={FolderOpen} value={error ? null : stat ? stat.total : null} label="Total Arsip" tone="bg-red-500/15 text-red-400" delay={0} />
          <StatCard icon={FileCheck2} value={error ? null : stat ? stat.terverifikasi : null} label="Arsip Terverifikasi" tone="bg-green-500/15 text-green-400" delay={120} />
          <StatCard icon={Cloud} value={error ? null : stat ? stat.digital : null} label="Arsip Digital" tone="bg-sky-500/15 text-sky-400" delay={240} />
        </div>
      </section>

      {/* FITUR */}
      <section id="fitur" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Semua yang Anda Butuhkan</h2>
          <p className="mt-3 text-slate-400">Untuk tata kelola arsip yang modern dan akuntabel</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {fitur.map((f, i) => (
            <div
              key={f.title}
              className="hover-lift animate-fade-up group rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-red-500/40 hover:bg-white/[0.07]"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="mb-4 inline-flex rounded-xl bg-red-500/15 p-3 text-red-400 transition-colors group-hover:bg-red-500/25">
                <f.icon size={24} />
              </div>
              <h3 className="mb-2 font-bold text-white">{f.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* KEUNGGULAN KEAMANAN */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Aman untuk{' '}
              <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                Dokumen Negara
              </span>
            </h2>
            <p className="mt-4 text-slate-400">
              Data kearsipan Bawaslu bersifat sensitif. SIAGA ARSIP dibangun dengan prinsip
              keamanan berlapis tanpa mengorbankan kemudahan penggunaan.
            </p>
            <ul className="mt-8 space-y-4">
              {keunggulan.map((k) => (
                <li key={k.text} className="flex items-start gap-3">
                  <span className="mt-0.5 rounded-lg bg-sky-500/15 p-2 text-sky-400">
                    <k.icon size={18} />
                  </span>
                  <span className="text-slate-300">{k.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8">
            <div className="mb-4 flex items-center gap-2 text-green-400">
              <CheckCircle2 size={20} />
              <span className="font-semibold">Status Sistem</span>
            </div>
            <div className="space-y-3">
              {[
                ['Server Aplikasi', 'Operasional'],
                ['Database Arsip', 'Terhubung'],
                ['Sistem Verifikasi', 'Aktif'],
              ].map(([label, status]) => (
                <div key={label} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="text-sm text-slate-300">{label}</span>
                  <span className="flex items-center gap-2 text-sm font-medium text-green-400">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA AKHIR */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/15 blur-[100px]" />
        <div className="relative mx-auto max-w-3xl px-6 py-24 text-center">
          <h2 className="animate-fade-up text-3xl font-bold sm:text-4xl">
            Siap Modernisasi Tata Kelola Arsip?
          </h2>
          <p className="animate-fade-up mt-4 text-slate-400" style={{ animationDelay: '100ms' }}>
            Bersama mengawal demokrasi — dimulai dari arsip yang tertata.
          </p>
          <Link
            to="/login"
            className="animate-fade-up mt-8 inline-flex items-center gap-2 rounded-xl bg-red-600 px-8 py-4 font-bold text-white shadow-xl shadow-red-600/30 transition-all hover:bg-red-500 active:scale-95"
            style={{ animationDelay: '200ms' }}
          >
            Masuk Aplikasi Sekarang
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-red-600 text-xs font-black">SA</span>
            <span className="text-sm text-slate-400">© 2026 Bawaslu Kabupaten Aceh Timur</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-400">
            <span>Tentang Aplikasi</span>
            <span>Bantuan</span>
            <span>Kontak</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

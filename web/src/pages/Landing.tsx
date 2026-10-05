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
  ScrollText,
  History,
  FileSearch,
} from 'lucide-react';

/**
 * Landing — design system "Trust & Authority" (ui-ux-pro-max):
 * Navy #0F172A + trust blue #0369A1 + merah Bawaslu #DC2626 sebagai aksen institusi.
 * Font: Lexend (heading) + Source Sans 3 (body) — corporate, trustworthy, government.
 * Pattern: Trust & Authority + Conversion — Hero (mission) > Proof (live stats)
 *          > Solution (fitur) > Keunggulan keamanan > CTA.
 */

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
      className="animate-fade-up rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-colors hover:border-white/20"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`mb-3 inline-flex rounded-xl p-2.5 ${tone}`}>
        <Icon size={22} />
      </div>
      <p className="text-3xl font-extrabold text-white tabular-nums" aria-label={`${n} ${label}`}>{n}</p>
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
    desc: 'Setiap arsip melewati proses verifikasi dengan jejak audit: siapa memverifikasi, kapan.',
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
  { icon: History, text: 'Jejak audit lengkap setiap perubahan arsip' },
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
    <main className="min-h-screen bg-slate-950 font-body text-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex shrink-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-700 font-heading font-black text-white shadow-lg shadow-red-600/20">SA</span>
            <span className="font-heading text-base font-bold tracking-tight sm:text-lg">
              SIAGA <span className="text-red-500">ARSIP</span>
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <a href="#fitur" className="hidden rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white sm:block">Fitur</a>
            <a href="#statistik" className="hidden rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white sm:block">Statistik</a>
            <a href="#keamanan" className="hidden rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white sm:block">Keamanan</a>
            <Link
              to="/login"
              className="whitespace-nowrap rounded-lg bg-sky-700 px-4 py-2 font-heading text-sm font-semibold text-white shadow-lg shadow-sky-900/30 transition-all hover:bg-sky-600 active:scale-95"
            >
              Masuk
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO — mission & credibility */}
      <header className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-sky-600/15 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 top-40 h-[300px] w-[400px] rounded-full bg-red-600/10 blur-[100px]" />
        {/* grid pattern halus */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(148,163,184,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.1) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)',
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-20 text-center sm:pt-24">
          <div className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-sm text-sky-300">
            <Landmark size={15} aria-hidden />
            Bawaslu Kabupaten Aceh Timur
          </div>
          <h1 className="animate-fade-up mx-auto max-w-3xl font-heading text-4xl font-black leading-tight tracking-tight sm:text-6xl" style={{ animationDelay: '100ms' }}>
            Arsip Tertata,
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              {' '}Kinerja Meningkat
            </span>
          </h1>
          <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400" style={{ animationDelay: '200ms' }}>
            Sistem administrasi &amp; digitalisasi arsip untuk pengawasan pemilu yang lebih baik.
            Kelola, verifikasi, dan digitalisasi seluruh arsip Bawaslu Aceh Timur dalam satu platform.
          </p>
          <div className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row" style={{ animationDelay: '300ms' }}>
            <Link
              to="/login"
              className="group inline-flex items-center gap-2 rounded-xl bg-sky-700 px-7 py-3.5 font-heading font-semibold text-white shadow-xl shadow-sky-900/30 transition-all hover:bg-sky-500 hover:shadow-sky-500/40 active:scale-95"
            >
              Masuk Aplikasi
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
            <a
              href="#fitur"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-7 py-3.5 font-heading font-semibold text-slate-200 transition-colors hover:border-white/30 hover:bg-white/5"
            >
              Pelajari Fitur
            </a>
          </div>
        </div>
      </header>

      {/* STATISTIK LIVE — proof */}
      <section id="statistik" aria-label="Statistik arsip live" className="relative mx-auto -mt-10 max-w-5xl px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard icon={FolderOpen} value={error ? null : stat ? stat.total : null} label="Total Arsip" tone="bg-sky-500/15 text-sky-400" delay={0} />
          <StatCard icon={FileCheck2} value={error ? null : stat ? stat.terverifikasi : null} label="Arsip Terverifikasi" tone="bg-green-500/15 text-green-400" delay={120} />
          <StatCard icon={Cloud} value={error ? null : stat ? stat.digital : null} label="Arsip Digital" tone="bg-red-500/15 text-red-400" delay={240} />
        </div>
      </section>

      {/* FITUR — solution overview */}
      <section id="fitur" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-14 text-center">
          <p className="font-heading text-sm font-semibold uppercase tracking-widest text-sky-400">Fitur Utama</p>
          <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">Semua yang Anda Butuhkan</h2>
          <p className="mt-3 text-slate-400">Untuk tata kelola arsip yang modern dan akuntabel</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {fitur.map((f, i) => (
            <div
              key={f.title}
              className="hover-lift animate-fade-up group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-colors hover:border-sky-500/40 hover:bg-white/[0.06]"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="mb-4 inline-flex rounded-xl bg-sky-500/15 p-3 text-sky-400 transition-colors group-hover:bg-sky-500/25">
                <f.icon size={24} aria-hidden />
              </div>
              <h3 className="mb-2 font-heading font-bold text-white">{f.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ALUR KERJA — 3 langkah, memperjelas jalur pengguna baru */}
      <section aria-label="Alur kerja" className="border-y border-white/5 bg-white/[0.02] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <p className="font-heading text-sm font-semibold uppercase tracking-widest text-sky-400">Alur Kerja</p>
            <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">Tiga Langkah Saja</h2>
          </div>
          <ol className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              { icon: Upload, judul: '1. Unggah', desc: 'Pilih subbagian, isi judul & nomor, unggah file PDF/JPG/PNG maks 10 MB.' },
              { icon: FileSearch, judul: '2. Verifikasi', desc: 'Arsip diperiksa personel berwenang — setiap keputusan tercatat di jejak audit.' },
              { icon: ScrollText, judul: '3. Lapor', desc: 'Rekapitulasi per subbagian siap dipresentasikan dalam satu klik.' },
            ].map((s, i) => (
              <li key={s.judul} className="animate-fade-up relative text-center" style={{ animationDelay: `${i * 120}ms` }}>
                <div className="mx-auto mb-4 inline-flex rounded-2xl border border-sky-500/20 bg-sky-500/10 p-4 text-sky-400">
                  <s.icon size={28} aria-hidden />
                </div>
                <h3 className="font-heading text-lg font-bold text-white">{s.judul}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-400">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* KEUNGGULAN KEAMANAN */}
      <section id="keamanan" className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="font-heading text-sm font-semibold uppercase tracking-widest text-red-400">Keamanan</p>
            <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
              Aman untuk{' '}
              <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
                Dokumen Negara
              </span>
            </h2>
            <p className="mt-4 leading-relaxed text-slate-400">
              Data kearsipan Bawaslu bersifat sensitif. SIAGA ARSIP dibangun dengan prinsip
              keamanan berlapis tanpa mengorbankan kemudahan penggunaan.
            </p>
            <ul className="mt-8 space-y-4">
              {keunggulan.map((k) => (
                <li key={k.text} className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 rounded-lg bg-red-500/15 p-2 text-red-400">
                    <k.icon size={18} aria-hidden />
                  </span>
                  <span className="text-slate-300">{k.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8">
            <div className="mb-4 flex items-center gap-2 text-green-400">
              <CheckCircle2 size={20} aria-hidden />
              <span className="font-heading font-semibold">Status Sistem</span>
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
                    <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" aria-hidden />
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
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-600/15 blur-[100px]" />
        <div className="relative mx-auto max-w-3xl px-6 py-24 text-center">
          <h2 className="animate-fade-up font-heading text-3xl font-bold sm:text-4xl">
            Siap Modernisasi Tata Kelola Arsip?
          </h2>
          <p className="animate-fade-up mt-4 text-slate-400" style={{ animationDelay: '100ms' }}>
            Bersama mengawal demokrasi — dimulai dari arsip yang tertata.
          </p>
          <Link
            to="/login"
            className="animate-fade-up mt-8 inline-flex items-center gap-2 rounded-xl bg-sky-700 px-8 py-4 font-heading font-bold text-white shadow-xl shadow-sky-900/30 transition-all hover:bg-sky-600 active:scale-95"
            style={{ animationDelay: '200ms' }}
          >
            Masuk Aplikasi Sekarang
            <ArrowRight size={18} aria-hidden />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-red-600 to-red-700 text-xs font-black text-white">SA</span>
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

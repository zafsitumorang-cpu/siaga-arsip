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
 * Landing — tema terang (putih) dengan palet logo Bawaslu:
 * merah #E30613 (perisai + surat suara) sebagai aksi utama,
 * emas #D5B267 (panel perisai) sebagai aksen institusi.
 * Teks navy/slate untuk kontras AA. Font: Lexend + Source Sans 3.
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
      className="animate-fade-up rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`mb-3 inline-flex rounded-xl p-2.5 ${tone}`}>
        <Icon size={22} aria-hidden />
      </div>
      <p className="text-3xl font-extrabold text-slate-900 tabular-nums">{n}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
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
    <main className="min-h-screen bg-white text-slate-900">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex shrink-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E30613] font-heading font-black text-white">SA</span>
            <span className="font-heading text-base font-bold tracking-tight text-slate-900 sm:text-lg">
              SIAGA <span className="text-[#E30613]">ARSIP</span>
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <a href="#fitur" className="hidden rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 sm:block">Fitur</a>
            <a href="#statistik" className="hidden rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 sm:block">Statistik</a>
            <a href="#keamanan" className="hidden rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 sm:block">Keamanan</a>
            <Link
              to="/login"
              className="whitespace-nowrap rounded-lg bg-[#C00510] px-4 py-2 font-heading text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#A0040D] active:scale-95"
            >
              Masuk
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-[#E30613]/5 blur-[100px]" />
        <div className="pointer-events-none absolute right-0 top-20 h-[280px] w-[360px] rounded-full bg-[#D5B267]/15 blur-[90px]" />

        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 text-center sm:pt-20">
          <div className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-[#D5B267]/50 bg-[#D5B267]/10 px-4 py-1.5 text-sm font-medium text-[#8a6d2f]">
            <Landmark size={15} aria-hidden />
            Bawaslu Kabupaten Aceh Timur
          </div>
          <h1 className="animate-fade-up mx-auto max-w-3xl font-heading text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-6xl" style={{ animationDelay: '100ms' }}>
            Arsip Tertata,{' '}
            <span className="text-[#E30613]">Kinerja Meningkat</span>
          </h1>
          <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600" style={{ animationDelay: '200ms' }}>
            Sistem administrasi &amp; digitalisasi arsip untuk pengawasan pemilu yang lebih baik.
            Kelola, verifikasi, dan digitalisasi seluruh arsip Bawaslu Aceh Timur dalam satu platform.
          </p>
          <div className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row" style={{ animationDelay: '300ms' }}>
            <Link
              to="/login"
              className="group inline-flex items-center gap-2 rounded-xl bg-[#C00510] px-7 py-3.5 font-heading font-semibold text-white shadow-lg shadow-[#E30613]/20 transition-all hover:bg-[#A0040D] hover:shadow-[#E30613]/30 active:scale-95"
            >
              Masuk Aplikasi
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
            <a
              href="#fitur"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-7 py-3.5 font-heading font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
            >
              Pelajari Fitur
            </a>
          </div>
        </div>
      </header>

      {/* STATISTIK LIVE */}
      <section id="statistik" aria-label="Statistik arsip live" className="mx-auto -mt-8 max-w-5xl px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard icon={FolderOpen} value={error ? null : stat ? stat.total : null} label="Total Arsip" tone="bg-[#E30613]/10 text-[#B00510]" delay={0} />
          <StatCard icon={FileCheck2} value={error ? null : stat ? stat.terverifikasi : null} label="Arsip Terverifikasi" tone="bg-emerald-50 text-emerald-700" delay={120} />
          <StatCard icon={Cloud} value={error ? null : stat ? stat.digital : null} label="Arsip Digital" tone="bg-[#D5B267]/20 text-[#8a6d2f]" delay={240} />
        </div>
      </section>

      {/* FITUR */}
      <section id="fitur" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-14 text-center">
          <p className="font-heading text-sm font-semibold uppercase tracking-widest text-[#B00510]">Fitur Utama</p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-slate-900 sm:text-4xl">Semua yang Anda Butuhkan</h2>
          <p className="mt-3 text-slate-600">Untuk tata kelola arsip yang modern dan akuntabel</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {fitur.map((f, i) => (
            <div
              key={f.title}
              className="hover-lift animate-fade-up group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-[#E30613]/40"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="mb-4 inline-flex rounded-xl bg-[#E30613]/10 p-3 text-[#B00510] transition-colors group-hover:bg-[#E30613]/15">
                <f.icon size={24} aria-hidden />
              </div>
              <h3 className="mb-2 font-heading font-bold text-slate-900">{f.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ALUR KERJA */}
      <section aria-label="Alur kerja" className="border-y border-slate-200 bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <p className="font-heading text-sm font-semibold uppercase tracking-widest text-[#B00510]">Alur Kerja</p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-slate-900 sm:text-4xl">Tiga Langkah Saja</h2>
          </div>
          <ol className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              { icon: Upload, judul: '1. Unggah', desc: 'Pilih subbagian, isi judul & nomor, unggah file PDF/JPG/PNG maks 10 MB.' },
              { icon: FileSearch, judul: '2. Verifikasi', desc: 'Arsip diperiksa personel berwenang — setiap keputusan tercatat di jejak audit.' },
              { icon: ScrollText, judul: '3. Lapor', desc: 'Rekapitulasi per subbagian siap dipresentasikan dalam satu klik.' },
            ].map((s, i) => (
              <li key={s.judul} className="animate-fade-up relative text-center" style={{ animationDelay: `${i * 120}ms` }}>
                <div className="mx-auto mb-4 inline-flex rounded-2xl border border-[#E30613]/15 bg-white p-4 text-[#B00510] shadow-sm">
                  <s.icon size={28} aria-hidden />
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-900">{s.judul}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-600">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* KEAMANAN */}
      <section id="keamanan" className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="font-heading text-sm font-semibold uppercase tracking-widest text-[#B00510]">Keamanan</p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-slate-900 sm:text-4xl">
              Aman untuk <span className="text-[#E30613]">Dokumen Negara</span>
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              Data kearsipan Bawaslu bersifat sensitif. SIAGA ARSIP dibangun dengan prinsip
              keamanan berlapis tanpa mengorbankan kemudahan penggunaan.
            </p>
            <ul className="mt-8 space-y-4">
              {keunggulan.map((k) => (
                <li key={k.text} className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 rounded-lg bg-[#E30613]/10 p-2 text-[#B00510]">
                    <k.icon size={18} aria-hidden />
                  </span>
                  <span className="text-slate-700">{k.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
            <div className="mb-4 flex items-center gap-2 text-emerald-700">
              <CheckCircle2 size={20} aria-hidden />
              <span className="font-heading font-semibold">Status Sistem</span>
            </div>
            <div className="space-y-3">
              {[
                ['Server Aplikasi', 'Operasional'],
                ['Database Arsip', 'Terhubung'],
                ['Sistem Verifikasi', 'Aktif'],
              ].map(([label, status]) => (
                <div key={label} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <span className="text-sm text-slate-600">{label}</span>
                  <span className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" aria-hidden />
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA AKHIR */}
      <section className="relative overflow-hidden border-t border-slate-200 bg-slate-50">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E30613]/5 blur-[90px]" />
        <div className="relative mx-auto max-w-3xl px-6 py-24 text-center">
          <h2 className="animate-fade-up font-heading text-3xl font-bold text-slate-900 sm:text-4xl">
            Siap Modernisasi Tata Kelola Arsip?
          </h2>
          <p className="animate-fade-up mt-4 text-slate-600" style={{ animationDelay: '100ms' }}>
            Bersama mengawal demokrasi — dimulai dari arsip yang tertata.
          </p>
          <Link
            to="/login"
            className="animate-fade-up mt-8 inline-flex items-center gap-2 rounded-xl bg-[#C00510] px-8 py-4 font-heading font-bold text-white shadow-lg shadow-[#E30613]/20 transition-all hover:bg-[#A0040D] active:scale-95"
            style={{ animationDelay: '200ms' }}
          >
            Masuk Aplikasi Sekarang
            <ArrowRight size={18} aria-hidden />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#E30613] text-xs font-black text-white">SA</span>
            <span className="text-sm text-slate-600">© 2026 Bawaslu Kabupaten Aceh Timur</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            <span>Tentang Aplikasi</span>
            <span>Bantuan</span>
            <span>Kontak</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

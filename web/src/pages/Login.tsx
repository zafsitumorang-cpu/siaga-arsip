import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Eye, EyeOff, Loader2, Lock, LogIn, ShieldCheck, User } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.post('/api/auth/login', { username, password });
      window.location.href = '/';
    } catch {
      setError('Username atau password salah');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-6">
      {/* Glow dekoratif */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-red-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[250px] w-[350px] rounded-full bg-sky-600/10 blur-[100px]" />
      {/* Grid pattern halus */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className={`relative my-auto w-full max-w-md ${shake ? 'animate-shake' : ''}`}>
        <div className="animate-fade-up rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-md">
          {/* Logo */}
          <div className="mb-5 text-center">
            <div className="animate-pop mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 shadow-lg shadow-red-600/30">
              <ShieldCheck size={22} className="text-white" />
            </div>
            <h1 className="text-xl font-black text-white">
              SIAGA <span className="text-red-500">ARSIP</span>
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Bawaslu Kabupaten Aceh Timur
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300" htmlFor="username">
                Username
              </label>
              <div className="group relative">
                <User
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-red-400"
                />
                <input
                  id="username"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-11 pr-4 text-white placeholder-slate-500 transition-all focus:border-red-500/60 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300" htmlFor="password">
                Password
              </label>
              <div className="group relative">
                <Lock
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-red-400"
                />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-11 pr-11 text-white placeholder-slate-500 transition-all focus:border-red-500/60 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 transition-colors hover:text-slate-300"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="animate-pop flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-red-400" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-red-600 py-3 font-semibold text-white shadow-lg shadow-red-600/25 transition-all hover:bg-red-500 hover:shadow-red-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Memverifikasi…
                </>
              ) : (
                <>
                  Masuk
                  <LogIn size={18} className="transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

        <p className="mt-3 text-center text-xs text-slate-500">
            Akses terbatas untuk personel berwenang
          </p>
        </div>

        <p className="mt-3 text-center text-sm text-slate-500">
          <Link to="/" className="transition-colors hover:text-slate-300">
            ← Kembali ke beranda
          </Link>
        </p>
      </div>
    </div>
  );
}

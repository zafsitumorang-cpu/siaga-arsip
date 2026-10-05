import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Archive,
  BarChart3,
  FileUp,
  Home,
  LogOut,
  Menu,
  User,
  Tag,
  Settings,
  X,
} from 'lucide-react';

const subbagianItems = [
  { to: '/arsip?subbagianId=1', label: 'Administrasi', color: 'bg-orange-400' },
  { to: '/arsip?subbagianId=2', label: 'Hukum', color: 'bg-blue-400' },
  { to: '/arsip?subbagianId=3', label: 'Pengawasan', color: 'bg-green-400' },
  {
    to: '/arsip?subbagianId=4',
    label: 'Penanganan Pelanggaran & Sengketa',
    color: 'bg-purple-400',
  },
];

const menu = [
  { to: '/', label: 'Beranda', icon: Home },
  { to: '/arsip', label: 'Arsip', icon: Archive },
  { to: '/upload', label: 'Upload', icon: FileUp },
  { to: '/klasifikasi', label: 'Klasifikasi', icon: Tag },
  { to: '/laporan', label: 'Laporan', icon: BarChart3 },
  { to: '/profil', label: 'Profil', icon: User },
  { to: '/pengaturan', label: 'Pengaturan', icon: Settings },
];

export default function Layout({ username }: { username: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Tutup drawer saat pindah halaman
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname, location.search]);

  const sidebarContent = (
    <>
      <div className="px-5 py-6">
        <div className="text-lg font-extrabold tracking-wide text-white">
          SIAGA <span className="text-red-500">ARSIP</span>
        </div>
        <div className="mt-0.5 text-[11px] text-slate-400">Bawaslu Kab. Aceh Timur</div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {menu.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={() => setDrawerOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-red-600 text-white shadow'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}

        <div className="px-3 pb-1 pt-5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Arsip per Subbag
        </div>
        {subbagianItems.map(({ to, label, color }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            onClick={() => setDrawerOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`
            }
          >
            <span className={`h-2 w-2 shrink-0 rounded-full ${color}`} />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-3">
        <div className="mb-2 flex items-center gap-2 px-2 text-xs text-slate-400">
          <User size={14} />
          {username}
        </div>
        <button
          onClick={async () => {
            await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(
              () => undefined,
            );
            window.location.href = '/login';
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
        >
          <LogOut size={16} />
          Keluar
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* Sidebar desktop (>= lg) — dipatok tinggi layar, scroll internal */}
      <aside className="hidden h-screen w-60 shrink-0 flex-col overflow-y-auto bg-slate-900 text-slate-300 lg:flex">
        {sidebarContent}
      </aside>

      {/* Drawer mobile (< lg) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="animate-fade-in absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
            aria-hidden
          />
          <aside className="animate-fade-in absolute left-0 top-0 flex h-full w-64 flex-col bg-slate-900 text-slate-300 shadow-2xl">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              aria-label="Tutup menu"
            >
              <X size={20} />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header atas: hamburger (mobile) + search global + notifikasi + profil */}
        <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
            aria-label="Buka menu"
          >
            <Menu size={20} />
          </button>

          <div className="hidden items-center gap-3 md:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600 text-sm font-extrabold text-white">
              SA
            </div>
            <div>
              <div className="text-sm font-extrabold leading-tight text-slate-800">
                SIAGA <span className="text-red-600">ARSIP</span>
              </div>
              <div className="text-[10px] leading-tight text-slate-500">
                Administrasi & Digitalisasi Arsip
              </div>
            </div>
          </div>

          <form
            className="ml-auto w-full max-w-md"
            onSubmit={(e) => {
              e.preventDefault();
              const q = new FormData(e.currentTarget).get('q');
              navigate(q ? `/arsip?search=${encodeURIComponent(String(q))}` : '/arsip');
            }}
          >
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle cx={11} cy={11} r={7} />
                <path d="m21 21-3.5-3.5" strokeLinecap="round" />
              </svg>
              <input
                name="q"
                type="search"
                placeholder="Cari arsip, nomor, atau kata kunci..."
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm text-slate-700 outline-none transition-colors focus:border-red-400 focus:bg-white"
              />
            </div>
          </form>

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              title="Notifikasi — belum ada yang baru"
              className="relative hidden h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 sm:flex"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.9 17.1a2 2 0 0 1-3.8 0M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"
                />
              </svg>
            </button>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 py-1 pl-1 pr-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">
                {username.slice(0, 1).toUpperCase()}
              </div>
              <div className="hidden text-left sm:block">
                <div className="text-xs font-semibold capitalize text-slate-700">{username}</div>
                <div className="text-[10px] text-slate-400">Bawaslu Aceh Timur</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>

        <footer className="border-t border-slate-200 bg-white px-6 py-4">
          <div className="flex flex-col items-center justify-between gap-2 text-xs text-slate-500 sm:flex-row">
            <span>© 2026 Bawaslu Kabupaten Aceh Timur — SIAGA ARSIP · Arsip Tertata, Kinerja Meningkat</span>
            <span className="flex gap-4">
              <a href="/arsip" className="hover:text-slate-700">Tentang Aplikasi</a>
              <a href="/pengaturan" className="hover:text-slate-700">Bantuan</a>
              <a href="/profil" className="hover:text-slate-700">Kontak</a>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

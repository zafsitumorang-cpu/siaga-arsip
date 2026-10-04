import { NavLink, Outlet } from 'react-router-dom';
import {
  Archive,
  BarChart3,
  FileUp,
  Home,
  LogOut,
  User,
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
  { to: '/laporan', label: 'Laporan', icon: BarChart3 },
];

export default function Layout({ username }: { username: string }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="flex w-60 shrink-0 flex-col bg-slate-900 text-slate-300">
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
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 p-6">
          <Outlet />
        </main>
        <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-xs text-slate-500">
          © 2026 Bawaslu Kabupaten Aceh Timur — SIAGA ARSIP · Arsip Tertata, Kinerja Meningkat
        </footer>
      </div>
    </div>
  );
}

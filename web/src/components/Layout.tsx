import { NavLink, Outlet } from 'react-router-dom';
import { Archive, FileUp, LayoutDashboard, LogOut } from 'lucide-react';

const menu = [
  { to: '/', label: 'Beranda', icon: LayoutDashboard },
  { to: '/arsip', label: 'Arsip', icon: Archive },
  { to: '/upload', label: 'Upload', icon: FileUp },
];

export default function Layout({ username }: { username: string }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="flex w-56 flex-col bg-slate-900 text-slate-300">
        <div className="px-4 py-5 text-lg font-bold text-white">SIAGA ARSIP</div>
        <nav className="flex-1 space-y-1 px-2">
          {menu.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded px-3 py-2 text-sm ${
                  isActive ? 'bg-slate-700 text-white' : 'hover:bg-slate-800'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
          <div className="flex items-center gap-3 rounded px-3 py-2 text-sm text-slate-500">
            <LayoutDashboard size={16} />
            Laporan (segera)
          </div>
        </nav>
        <button
          onClick={async () => {
            await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(
              () => undefined,
            );
            window.location.href = '/login';
          }}
          className="m-2 flex items-center gap-3 rounded px-3 py-2 text-sm hover:bg-slate-800"
        >
          <LogOut size={16} />
          Keluar ({username})
        </button>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

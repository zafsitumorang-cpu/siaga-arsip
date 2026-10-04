import { ReactNode } from 'react';
import { Archive, Cloud, FileCheck2, FolderOpen, LucideProps } from 'lucide-react';

type Tone = 'red' | 'blue' | 'green' | 'purple';

const tones: Record<Tone, { border: string; tile: string; text: string }> = {
  red: { border: 'border-l-red-600', tile: 'bg-red-50 text-red-600', text: 'text-red-600' },
  blue: { border: 'border-l-blue-600', tile: 'bg-blue-50 text-blue-600', text: 'text-blue-600' },
  green: {
    border: 'border-l-green-600',
    tile: 'bg-green-50 text-green-600',
    text: 'text-green-600',
  },
  purple: {
    border: 'border-l-purple-600',
    tile: 'bg-purple-50 text-purple-600',
    text: 'text-purple-600',
  },
};

export function StatCard({
  label,
  value,
  tone = 'blue',
  icon: Icon = FolderOpen,
}: {
  label: string;
  value: ReactNode;
  tone?: Tone;
  icon?: (props: LucideProps) => ReactNode;
}) {
  const t = tones[tone];
  return (
    <div className={`flex items-center gap-4 rounded-xl border border-l-4 border-slate-200 ${t.border} bg-white p-5 shadow-sm`}>
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${t.tile}`}>
        <Icon size={24} />
      </div>
      <div className="min-w-0">
        <div className="text-2xl font-bold text-slate-800">{value}</div>
        <div className="truncate text-sm text-slate-500">{label}</div>
      </div>
    </div>
  );
}

export function StatCards() {
  return (
    <>
      <StatCard tone="red" icon={Archive} label="Total Arsip" value="…" />
      <StatCard tone="blue" icon={FolderOpen} label="Arsip Aktif" value="…" />
      <StatCard tone="green" icon={FileCheck2} label="Terverifikasi" value="…" />
      <StatCard tone="purple" icon={Cloud} label="Arsip Digital" value="…" />
    </>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const cls =
    status === 'TERVERIFIKASI'
      ? 'bg-green-100 text-green-700'
      : 'bg-amber-100 text-amber-700';
  const label = status === 'TERVERIFIKASI' ? 'Terverifikasi' : 'Menunggu Verifikasi';
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}

export function Pagination({
  page,
  pageSize,
  total,
  onPage,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPage: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between pt-3 text-sm text-slate-600">
      <span>
        menampilkan {from}–{to} dari {total}
      </span>
      <span className="flex gap-2">
        <button
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 transition-colors hover:bg-slate-50 disabled:opacity-40"
        >
          ‹ Sebelumnya
        </button>
        <span className="px-2 py-1.5">
          Halaman {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => onPage(page + 1)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 transition-colors hover:bg-slate-50 disabled:opacity-40"
        >
          Berikutnya ›
        </button>
      </span>
    </div>
  );
}

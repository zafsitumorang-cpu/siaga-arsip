import { ReactNode } from 'react';

export function StatCard({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-sm">
      <div className="text-2xl font-bold text-slate-800">{value}</div>
      <div className="mt-1 text-sm text-slate-500">{label}</div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const cls =
    status === 'TERVERIFIKASI'
      ? 'bg-green-100 text-green-700'
      : 'bg-yellow-100 text-yellow-700';
  const label = status === 'TERVERIFIKASI' ? 'Terverifikasi' : 'Menunggu Verifikasi';
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
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
          className="rounded border px-3 py-1 disabled:opacity-40"
        >
          ‹ Sebelumnya
        </button>
        <span className="px-2 py-1">
          Halaman {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => onPage(page + 1)}
          className="rounded border px-3 py-1 disabled:opacity-40"
        >
          Berikutnya ›
        </button>
      </span>
    </div>
  );
}

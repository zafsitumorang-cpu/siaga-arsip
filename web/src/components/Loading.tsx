import { Loader2 } from 'lucide-react';

/** Halaman penuh: spinner + teks (untuk load awal app) */
export function PageLoading({ text = 'Memuat…' }: { text?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950">
      <div className="animate-pop flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 shadow-lg shadow-red-600/30">
        <Loader2 size={28} className="animate-spin text-white" />
      </div>
      <p className="animate-fade-in text-sm text-slate-400">{text}</p>
    </div>
  );
}

/** Skeleton bar generik */
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200/80 ${className}`} />;
}

/** Skeleton kartu statistik (grid 4) */
export function StatSkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-11 w-11 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Skeleton baris tabel */
export function TableSkeletonRows({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="border-t border-slate-100">
          {Array.from({ length: cols }).map((_, c) => (
            <td key={c} className="py-3 pr-4">
              <Skeleton className={`h-4 ${c === 0 ? 'w-40' : 'w-20'}`} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/** Tombol dengan spinner inline */
export function LoadingButton({
  loading,
  children,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={`inline-flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}

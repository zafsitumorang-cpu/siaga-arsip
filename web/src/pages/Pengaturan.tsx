import { useState } from 'react';
import { Bell, Database, Palette, Save } from 'lucide-react';

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        enabled ? 'bg-red-600' : 'bg-slate-300'
      }`}
      aria-pressed={enabled}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
          enabled ? 'left-[1.375rem]' : 'left-0.5'
        }`}
      />
    </button>
  );
}

export default function Pengaturan() {
  const [notifVerifikasi, setNotifVerifikasi] = useState(true);
  const [notifUpload, setNotifUpload] = useState(false);
  const [tabelPadat, setTabelPadat] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Pengaturan</h1>
        <p className="mt-1 text-sm text-slate-500">
          Preferensi tampilan dan notifikasi aplikasi SIAGA ARSIP.
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-bold text-slate-800">
          <Bell size={18} className="text-amber-500" />
          Notifikasi
        </h2>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">Pengingat verifikasi arsip</p>
              <p className="text-xs text-slate-500">
                Tampilkan pengingat untuk arsip yang masih menunggu verifikasi.
              </p>
            </div>
            <Toggle enabled={notifVerifikasi} onChange={setNotifVerifikasi} />
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <div>
              <p className="text-sm font-medium text-slate-700">Notifikasi upload baru</p>
              <p className="text-xs text-slate-500">
                Beri tahu saat ada arsip baru diunggah oleh subbagian.
              </p>
            </div>
            <Toggle enabled={notifUpload} onChange={setNotifUpload} />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-bold text-slate-800">
          <Palette size={18} className="text-purple-500" />
          Tampilan
        </h2>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">Mode tabel padat</p>
              <p className="text-xs text-slate-500">
                Tampilkan lebih banyak baris arsip dengan jarak lebih rapat.
              </p>
            </div>
            <Toggle enabled={tabelPadat} onChange={setTabelPadat} />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-bold text-slate-800">
          <Database size={18} className="text-sky-600" />
          Penyimpanan
        </h2>
        <div className="mt-3 rounded-xl bg-amber-50 p-4 text-xs leading-relaxed text-slate-600">
          File arsip tersimpan di penyimpanan lokal server dan basis data di cloud Neon
          PostgreSQL. Untuk ketahanan data jangka panjang, pertimbangkan pencadangan berkala.
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow transition-colors hover:bg-red-700"
        >
          <Save size={16} />
          Simpan Pengaturan
        </button>
        {saved && <span className="text-sm font-medium text-green-600">Tersimpan ✓</span>}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Building2, ShieldCheck } from 'lucide-react';
import { api } from '../lib/api';

interface Me {
  username: string;
  role: string;
}

export default function Profil() {
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    api.get('/api/auth/me').then((d) => setMe(d as Me));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-800">Profil</h1>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Akun */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl font-extrabold text-red-600">
              {(me?.username ?? 'A').slice(0, 1).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold capitalize text-slate-800">
                {me?.username ?? '…'}
              </h2>
              <span className="mt-1 inline-block rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                {me?.role ?? '…'}
              </span>
            </div>
          </div>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <dt className="text-slate-500">Username</dt>
              <dd className="font-medium text-slate-700">{me?.username ?? '…'}</dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <dt className="text-slate-500">Peran</dt>
              <dd className="font-medium text-slate-700">Administrator</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Unit</dt>
              <dd className="font-medium text-slate-700">Bawaslu Kab. Aceh Timur</dd>
            </div>
          </dl>
        </section>

        {/* Tentang instansi */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <Building2 size={22} />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">Badan Pengawas Pemilihan Umum</h2>
              <p className="text-xs text-slate-500">Kabupaten Aceh Timur</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            SIAGA ARSIP adalah Sistem Informasi Administrasi dan Digitalisasi Arsip yang
            dikelola oleh Bawaslu Kabupaten Aceh Timur untuk mendukung tata kelola arsip yang
            tertata, aman, dan mudah diakses di seluruh subbagian.
          </p>
          <div className="mt-4 flex items-start gap-3 rounded-xl bg-sky-50 p-4">
            <ShieldCheck size={20} className="mt-0.5 shrink-0 text-sky-600" />
            <p className="text-xs leading-relaxed text-slate-600">
              Kontak: Sekretariat Bawaslu Kabupaten Aceh Timur. Untuk bantuan penggunaan
              aplikasi, hubungi admin melalui jalur resmi instansi.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

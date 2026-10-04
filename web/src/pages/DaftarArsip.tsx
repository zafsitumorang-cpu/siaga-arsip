import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import { Pagination, StatusBadge } from '../components/StatCard';

interface ArsipItem {
  id: number;
  judul: string;
  nomor: string | null;
  subbagianId: number;
  subbagianNama: string;
  tanggalDokumen: string | null;
  status: 'MENUNGGU' | 'TERVERIFIKASI';
}

interface Subbagian {
  id: number;
  nama: string;
}

interface ListResponse {
  items: ArsipItem[];
  total: number;
  page: number;
  pageSize: number;
}

export default function DaftarArsip() {
  const [params, setParams] = useSearchParams();
  const [items, setItems] = useState<ArsipItem[]>([]);
  const [total, setTotal] = useState(0);
  const [subbagian, setSubbagian] = useState<Subbagian[]>([]);
  const [searchInput, setSearchInput] = useState(params.get('search') ?? '');
  const page = Number(params.get('page') ?? '1');
  const subbagianId = params.get('subbagianId') ?? '';
  const status = params.get('status') ?? '';

  useEffect(() => {
    api.get('/api/subbagian-list').catch(() => undefined);
    api
      .get('/api/arsip?pageSize=1')
      .then(() => undefined)
      .catch(() => undefined);
  }, []);

  // ambil daftar subbagian dari hasil arsip (nama unik) — endpoint khusus tidak ada di backend.
  useEffect(() => {
    api.get('/api/arsip?pageSize=100').then((d) => {
      const all = (d as ListResponse).items;
      const seen = new Map<number, string>();
      all.forEach((a) => seen.set(a.subbagianId, a.subbagianNama));
      setSubbagian(
        [...seen.entries()].sort((x, y) => x[0] - y[0]).map(([id, nama]) => ({ id, nama })),
      );
    });
  }, []);

  useEffect(() => {
    const qs = new URLSearchParams();
    qs.set('page', String(page));
    qs.set('pageSize', '10');
    const search = params.get('search') ?? '';
    if (search) qs.set('search', search);
    if (subbagianId) qs.set('subbagianId', subbagianId);
    if (status) qs.set('status', status);

    const t = setTimeout(() => {
      api.get(`/api/arsip?${qs.toString()}`).then((d) => {
        const res = d as ListResponse;
        setItems(res.items);
        setTotal(res.total);
      });
    }, 300);
    return () => clearTimeout(t);
  }, [page, params, subbagianId, status]);

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page');
    setParams(next);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-800">Daftar Arsip</h1>

      <div className="flex gap-3">
        <input
          placeholder="Cari judul…"
          className="w-64 rounded border border-slate-300 px-3 py-2 text-sm"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            updateParam('search', e.target.value);
          }}
        />
        <select
          className="rounded border border-slate-300 px-3 py-2 text-sm"
          value={subbagianId}
          onChange={(e) => updateParam('subbagianId', e.target.value)}
        >
          <option value="">Semua Subbagian</option>
          {subbagian.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nama}
            </option>
          ))}
        </select>
        <select
          className="rounded border border-slate-300 px-3 py-2 text-sm"
          value={status}
          onChange={(e) => updateParam('status', e.target.value)}
        >
          <option value="">Semua Status</option>
          <option value="MENUNGGU">Menunggu Verifikasi</option>
          <option value="TERVERIFIKASI">Terverifikasi</option>
        </select>
      </div>

      <div className="rounded-lg bg-white p-5 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="pb-2">Judul</th>
              <th className="pb-2">Nomor</th>
              <th className="pb-2">Subbagian</th>
              <th className="pb-2">Tanggal</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="py-2">
                  <Link to={`/arsip/${a.id}`} className="text-blue-600 hover:underline">
                    {a.judul}
                  </Link>
                </td>
                <td className="py-2">{a.nomor ?? '—'}</td>
                <td className="py-2">{a.subbagianNama}</td>
                <td className="py-2">
                  {a.tanggalDokumen
                    ? new Date(a.tanggalDokumen).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '—'}
                </td>
                <td className="py-2">
                  <StatusBadge status={a.status} />
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="py-4 text-center text-slate-400">
                  Tidak ada arsip
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          page={page}
          pageSize={10}
          total={total}
          onPage={(p) => updateParam('page', String(p))}
        />
      </div>
    </div>
  );
}

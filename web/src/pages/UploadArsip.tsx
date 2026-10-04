import { FormEvent, useState } from 'react';
import { api, ApiError } from '../lib/api';
import { useToast } from '../components/Toast';

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export default function UploadArsip() {
  const toast = useToast();
  const [judul, setJudul] = useState('');
  const [nomor, setNomor] = useState('');
  const [subbagianId, setSubbagianId] = useState('');
  const [tanggalDokumen, setTanggalDokumen] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!file) {
      setMessage({ type: 'err', text: 'File wajib dipilih' });
      return;
    }
    if (file.size > MAX_SIZE) {
      setMessage({ type: 'err', text: 'Ukuran file melebihi 10 MB' });
      return;
    }

    const form = new FormData();
    form.set('judul', judul);
    if (nomor) form.set('nomor', nomor);
    form.set('subbagianId', subbagianId);
    if (tanggalDokumen) form.set('tanggalDokumen', tanggalDokumen);
    form.set('file', file);

    setSubmitting(true);
    try {
      await api.postForm('/api/arsip', form);
      setMessage({ type: 'ok', text: 'Arsip berhasil diunggah' });
      toast('success', 'Arsip berhasil diunggah.');
      setJudul('');
      setNomor('');
      setSubbagianId('');
      setTanggalDokumen('');
      setFile(null);
      const input = document.getElementById('file') as HTMLInputElement | null;
      if (input) input.value = '';
    } catch (err) {
      const text =
        err instanceof ApiError && err.body && typeof err.body === 'object' && 'message' in err.body
          ? String((err.body as { message: unknown }).message)
          : 'Gagal mengunggah arsip';
      setMessage({ type: 'err', text });
      toast('error', text);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg space-y-4">
      <h1 className="text-xl font-bold text-slate-800">Upload Arsip</h1>

      <form onSubmit={onSubmit} className="space-y-4 rounded-lg bg-white p-5 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="judul">
            Judul <span className="text-red-500">*</span>
          </label>
          <input
            id="judul"
            required
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="nomor">
            Nomor
          </label>
          <input
            id="nomor"
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
            value={nomor}
            onChange={(e) => setNomor(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="subbagian">
            Subbagian <span className="text-red-500">*</span>
          </label>
          <select
            id="subbagian"
            required
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
            value={subbagianId}
            onChange={(e) => setSubbagianId(e.target.value)}
          >
            <option value="">— pilih —</option>
            <option value="1">Administrasi</option>
            <option value="2">Hukum</option>
            <option value="3">Pengawasan</option>
            <option value="4">Penanganan Pelanggaran dan Penyelesaian Sengketa</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="tanggal">
            Tanggal Dokumen
          </label>
          <input
            id="tanggal"
            type="date"
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
            value={tanggalDokumen}
            onChange={(e) => setTanggalDokumen(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="file">
            File (PDF/JPG/PNG, maks 10 MB) <span className="text-red-500">*</span>
          </label>
          <input
            id="file"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="w-full text-sm"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>

        {message && (
          <p className={`text-sm ${message.type === 'ok' ? 'text-green-600' : 'text-red-600'}`}>
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Mengunggah…' : 'Unggah'}
        </button>
      </form>
    </div>
  );
}

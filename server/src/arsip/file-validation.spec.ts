import { validateUpload } from './file-validation';

describe('validateUpload', () => {
  it('menerima pdf valid', () => {
    expect(validateUpload('application/pdf', 'dokumen.pdf', 1024)).toEqual({ ok: true });
  });

  it('menerima jpg/jpeg/png valid', () => {
    expect(validateUpload('image/jpeg', 'foto.jpg', 1024)).toEqual({ ok: true });
    expect(validateUpload('image/jpeg', 'foto.jpeg', 1024)).toEqual({ ok: true });
    expect(validateUpload('image/png', 'gambar.PNG', 1024)).toEqual({ ok: true });
  });

  it('menolak mimetype tidak diizinkan meski ekstensi cocok', () => {
    const r = validateUpload('application/x-msdownload', 'evil.pdf', 1024);
    expect(r.ok).toBe(false);
    expect(r.reason).toBeDefined();
  });

  it('menolak ekstensi tidak diizinkan meski mimetype dipalsukan', () => {
    const r = validateUpload('application/pdf', 'evil.exe', 1024);
    expect(r.ok).toBe(false);
  });

  it('menolak file di atas 10 MB', () => {
    const r = validateUpload('application/pdf', 'besar.pdf', 10 * 1024 * 1024 + 1);
    expect(r.ok).toBe(false);
  });

  it('menerima file tepat 10 MB', () => {
    expect(validateUpload('application/pdf', 'batas.pdf', 10 * 1024 * 1024)).toEqual({ ok: true });
  });
});

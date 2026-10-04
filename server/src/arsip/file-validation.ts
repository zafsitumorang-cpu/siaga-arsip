export interface ValidateUploadResult {
  ok: boolean;
  reason?: string;
}

const ALLOWED_MIMETYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export function validateUpload(
  mimetype: string,
  originalname: string,
  size: number,
): ValidateUploadResult {
  if (!ALLOWED_MIMETYPES.includes(mimetype)) {
    return { ok: false, reason: `Tipe file ${mimetype} tidak diizinkan` };
  }
  const dot = originalname.lastIndexOf('.');
  const ext = dot === -1 ? '' : originalname.slice(dot).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return { ok: false, reason: `Ekstensi file ${ext || '(tidak ada)'} tidak diizinkan` };
  }
  if (size > MAX_SIZE) {
    return { ok: false, reason: 'Ukuran file melebihi 10 MB' };
  }
  return { ok: true };
}

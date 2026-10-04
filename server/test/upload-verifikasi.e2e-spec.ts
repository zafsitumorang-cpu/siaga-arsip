import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { existsSync, mkdirSync, rmSync, readFileSync } from 'fs';
import { join } from 'path';
import { AppModule } from '../src/app.module';

const UPLOADS_DIR = join(__dirname, '..', 'uploads');

describe('Upload & Verifikasi (e2e)', () => {
  let app: INestApplication;
  let agent: any;

  beforeAll(async () => {
    rmSync(UPLOADS_DIR, { recursive: true, force: true });
    mkdirSync(UPLOADS_DIR, { recursive: true });

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? 'admin';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? '';
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD });
    const raw = Array.isArray(res.headers['set-cookie'])
      ? res.headers['set-cookie'][0]
      : res.headers['set-cookie'];
    const cookie = raw.split(';')[0];
    agent = request.agent(app.getHttpServer());
    agent.set('Cookie', cookie);
  });

  afterAll(async () => {
    await app.close();
  });

  it('(a) upload sample.pdf valid → 201, isDigital=true, status=MENUNGGU, file tersimpan', async () => {
    const res = await agent
      .post('/api/arsip')
      .field('judul', 'Arsip Uji Upload')
      .field('nomor', 'UJI-001')
      .field('subbagianId', '1')
      .field('tanggalDokumen', '2025-10-01')
      .attach('file', Buffer.from('%PDF-1.4 test'), { filename: 'sample.pdf', contentType: 'application/pdf' })
      .expect(201);

    expect(res.body.isDigital).toBe(true);
    expect(res.body.status).toBe('MENUNGGU');
    expect(res.body.judul).toBe('Arsip Uji Upload');
    expect(res.body.fileNama).toBe('sample.pdf');

    // file fisik ada di uploads/
    const files = listUploads();
    expect(files.length).toBeGreaterThan(0);
    const uploaded = listUploads()[0];
    expect(uploaded).toBeDefined();
    expect(existsSync(join(UPLOADS_DIR, uploaded))).toBe(true);
    expect(readFileSync(join(UPLOADS_DIR, uploaded)).toString()).toContain('%PDF');
  });

  it('(b) upload evil.exe dengan mimetype dipalsukan application/pdf → 400, tidak ada baris Arsip baru', async () => {
    const before = await agent.get('/api/arsip?pageSize=1').expect(200);
    const res = await agent
      .post('/api/arsip')
      .field('judul', 'Arsip Jahat')
      .field('subbagianId', '1')
      .attach('file', Buffer.from('MZ...'), { filename: 'evil.exe', contentType: 'application/pdf' })
      .expect(400);
    expect(res.body.statusCode).toBe(400);
    const after = await agent.get('/api/arsip?pageSize=1').expect(200);
    expect(after.body.total).toBe(before.body.total);
    expect(listUploads().some((f) => f.endsWith('.exe'))).toBe(false);
  });

  it('(c) upload 11 MB → 400/413, tidak ada baris baru', async () => {
    const before = await agent.get('/api/arsip?pageSize=1').expect(200);
    await agent
      .post('/api/arsip')
      .field('judul', 'Arsip Besar')
      .field('subbagianId', '1')
      .attach('file', Buffer.alloc(11 * 1024 * 1024), { filename: 'besar.pdf', contentType: 'application/pdf' })
      .expect((r: request.Response) => {
        expect([400, 413]).toContain(r.status);
      });
    const after = await agent.get('/api/arsip?pageSize=1').expect(200);
    expect(after.body.total).toBe(before.body.total);
  });

  it('(d) PATCH verifikasi → status TERVERIFIKASI', async () => {
    const created = await agent
      .post('/api/arsip')
      .field('judul', 'Arsip Verifikasi Uji')
      .field('subbagianId', '1')
      .attach('file', Buffer.from('%PDF-1.4 v'), { filename: 'verif.pdf', contentType: 'application/pdf' })
      .expect(201);
    expect(created.body.status).toBe('MENUNGGU');

    const res = await agent.patch(`/api/arsip/${created.body.id}/verifikasi`).expect(200);
    expect(res.body.status).toBe('TERVERIFIKASI');
  });

  it('(e) verifikasi kedua kali tetap 200 TERVERIFIKASI (idempotent)', async () => {
    const created = await agent
      .post('/api/arsip')
      .field('judul', 'Arsip Idempotent')
      .field('subbagianId', '2')
      .attach('file', Buffer.from('%PDF-1.4 i'), { filename: 'idem.pdf', contentType: 'application/pdf' })
      .expect(201);

    await agent.patch(`/api/arsip/${created.body.id}/verifikasi`).expect(200);
    const res = await agent.patch(`/api/arsip/${created.body.id}/verifikasi`).expect(200);
    expect(res.body.status).toBe('TERVERIFIKASI');
  });

  it('(f) PATCH verifikasi id 999999 → 404', async () => {
    await agent.patch('/api/arsip/999999/verifikasi').expect(404);
  });

  it('(g) GET /api/arsip/:id/file mengirimkan dokumen', async () => {
    const created = await agent
      .post('/api/arsip')
      .field('judul', 'Arsip Streaming Uji')
      .field('subbagianId', '1')
      .attach('file', Buffer.from('%PDF-1.4 stream'), { filename: 'stream.pdf', contentType: 'application/pdf' })
      .expect(201);

    const res = await agent.get(`/api/arsip/${created.body.id}/file`).expect(200);
    expect(res.headers['content-type']).toContain('application/pdf');
    expect(res.body.toString()).toContain('%PDF');
  });
});

function listUploads(): string[] {
  try {
    return require('fs').readdirSync(UPLOADS_DIR);
  } catch {
    return [];
  }
}

import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { AppModule } from '../src/app.module';

const UPLOADS_DIR = join(__dirname, '..', 'uploads');

describe('Jejak audit verifikasi (e2e)', () => {
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

  it('(a) upload + verifikasi → riwayat berisi DIBUAT lalu DIVERIFIKASI dengan username', async () => {
    const created = await agent
      .post('/api/arsip')
      .field('judul', 'Arsip Audit Trail')
      .field('subbagianId', '1')
      .attach('file', Buffer.from('%PDF-1.4 audit'), { filename: 'audit.pdf', contentType: 'application/pdf' })
      .expect(201);
    const id = created.body.id;

    // verifikasi mengembalikan verifiedByUsername & verifiedAt
    const ver = await agent.patch(`/api/arsip/${id}/verifikasi`).expect(200);
    expect(ver.body.status).toBe('TERVERIFIKASI');
    expect(ver.body.verifiedByUsername).toBe(process.env.ADMIN_USERNAME ?? 'admin');
    expect(ver.body.verifiedAt).toBeTruthy();

    // GET riwayat
    const res = await agent.get(`/api/arsip/${id}/riwayat`).expect(200);
    const aksi = res.body.map((r: any) => r.aksi);
    expect(aksi).toEqual(['DIBUAT', 'DIVERIFIKASI']);
    const diverifikasi = res.body.find((r: any) => r.aksi === 'DIVERIFIKASI');
    expect(diverifikasi.username).toBe(process.env.ADMIN_USERNAME ?? 'admin');
    expect(diverifikasi.createdAt).toBeTruthy();
  });

  it('(b) verifikasi idempotent (klik dua kali) → riwayat TIDAK mendapat entri DIVERIFIKASI kedua', async () => {
    const created = await agent
      .post('/api/arsip')
      .field('judul', 'Arsip Audit Idempotent')
      .field('subbagianId', '2')
      .attach('file', Buffer.from('%PDF-1.4 idem2'), { filename: 'idem2.pdf', contentType: 'application/pdf' })
      .expect(201);
    const id = created.body.id;

    await agent.patch(`/api/arsip/${id}/verifikasi`).expect(200);
    await agent.patch(`/api/arsip/${id}/verifikasi`).expect(200);

    const res = await agent.get(`/api/arsip/${id}/riwayat`).expect(200);
    const verifCount = res.body.filter((r: any) => r.aksi === 'DIVERIFIKASI').length;
    expect(verifCount).toBe(1);
  });

  it('(c) GET riwayat arsip tanpa riwayat (id lama) → 200 array (bisa kosong)', async () => {
    const res = await agent.get('/api/arsip/1/riwayat').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('(d) GET riwayat id 999999 → 404', async () => {
    await agent.get('/api/arsip/999999/riwayat').expect(404);
  });

  it('(e) GET riwayat tanpa auth → 401', async () => {
    await request(app.getHttpServer()).get('/api/arsip/1/riwayat').expect(401);
  });
});

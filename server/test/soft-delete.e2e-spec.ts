import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { AppModule } from '../src/app.module';

const UPLOADS_DIR = join(__dirname, '..', 'uploads');

describe('Soft delete & pulihkan arsip (e2e)', () => {
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
    agent = request.agent(app.getHttpServer());
    agent.set('Cookie', raw.split(';')[0]);
  });

  afterAll(async () => {
    await app.close();
  });

  it('(a) DELETE → arsip hilang dari daftar & detail 404, data masih di DB (soft delete)', async () => {
    const created = await agent
      .post('/api/arsip')
      .field('judul', 'Arsip Akan Dihapus')
      .field('subbagianId', '1')
      .attach('file', Buffer.from('%PDF-1.4 del'), { filename: 'del.pdf', contentType: 'application/pdf' })
      .expect(201);
    const id = created.body.id;

    const before = await agent.get('/api/arsip?pageSize=1').expect(200);
    await agent.delete(`/api/arsip/${id}`).expect(200);
    expect((await agent.get('/api/arsip?pageSize=1').expect(200)).body.total).toBe(before.body.total - 1);
    await agent.get(`/api/arsip/${id}`).expect(404);

    // riwayat mencatat DIHAPUS
    const rw = await agent.get(`/api/arsip/${id}/riwayat`).expect(200);
    expect(rw.body.some((r: any) => r.aksi === 'DIHAPUS')).toBe(true);
  });

  it('(b) PATCH pulihkan → arsip kembali muncul & riwayat DIPULIHKAN tercatat', async () => {
    const created = await agent
      .post('/api/arsip')
      .field('judul', 'Arsip Pulihkan Uji')
      .field('subbagianId', '2')
      .attach('file', Buffer.from('%PDF-1.4 rst'), { filename: 'rst.pdf', contentType: 'application/pdf' })
      .expect(201);
    const id = created.body.id;

    await agent.delete(`/api/arsip/${id}`).expect(200);
    await agent.get(`/api/arsip/${id}`).expect(404);
    await agent.patch(`/api/arsip/${id}/pulihkan`).expect(200);
    await agent.get(`/api/arsip/${id}`).expect(200);

    const rw = await agent.get(`/api/arsip/${id}/riwayat`).expect(200);
    expect(rw.body.some((r: any) => r.aksi === 'DIPULIHKAN')).toBe(true);
  });

  it('(c) DELETE dua kali → kedua kalinya 404', async () => {
    const created = await agent
      .post('/api/arsip')
      .field('judul', 'Arsip Hapus Ganda')
      .field('subbagianId', '1')
      .attach('file', Buffer.from('%PDF-1.4 dbl'), { filename: 'dbl.pdf', contentType: 'application/pdf' })
      .expect(201);
    await agent.delete(`/api/arsip/${created.body.id}`).expect(200);
    await agent.delete(`/api/arsip/${created.body.id}`).expect(404);
  });

  it('(d) pulihkan arsip yang tidak sedang dihapus → 404', async () => {
    const created = await agent
      .post('/api/arsip')
      .field('judul', 'Arsip Tidak Dihapus')
      .field('subbagianId', '1')
      .attach('file', Buffer.from('%PDF-1.4 nd'), { filename: 'nd.pdf', contentType: 'application/pdf' })
      .expect(201);
    await agent.patch(`/api/arsip/${created.body.id}/pulihkan`).expect(404);
  });

  it('(e) statistik tidak menghitung arsip terhapus', async () => {
    const created = await agent
      .post('/api/arsip')
      .field('judul', 'Arsip Statistik Hapus')
      .field('subbagianId', '1')
      .attach('file', Buffer.from('%PDF-1.4 st'), { filename: 'st.pdf', contentType: 'application/pdf' })
      .expect(201);
    const before = await agent.get('/api/statistik').expect(200);
    await agent.delete(`/api/arsip/${created.body.id}`).expect(200);
    const after = await agent.get('/api/statistik').expect(200);
    expect(after.body.total).toBe(before.body.total - 1);
  });
});

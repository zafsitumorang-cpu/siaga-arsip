import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { AppModule } from '../src/app.module';

const UPLOADS_DIR = join(__dirname, '..', 'uploads');

describe('Alur penuh (e2e)', () => {
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

  it('statistik terverifikasi bertambah setelah upload + verifikasi', async () => {
    const awal = (await agent.get('/api/statistik').expect(200)).body;

    const created = await agent
      .post('/api/arsip')
      .field('judul', 'Arsip Alur Penuh')
      .field('subbagianId', '1')
      .attach('file', Buffer.from('%PDF-1.4 flow'), {
        filename: 'flow.pdf',
        contentType: 'application/pdf',
      })
      .expect(201);

    await agent.patch(`/api/arsip/${created.body.id}/verifikasi`).expect(200);

    const akhir = (await agent.get('/api/statistik').expect(200)).body;

    expect(akhir.total).toBe(awal.total + 1);
    expect(akhir.terverifikasi).toBe(awal.terverifikasi + 1);
    expect(akhir.digital).toBe(awal.digital + 1);
  });
});

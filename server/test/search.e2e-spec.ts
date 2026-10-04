import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { mkdirSync } from 'fs';
import { join } from 'path';
import { AppModule } from '../src/app.module';

const UPLOADS_DIR = join(__dirname, '..', 'uploads');
const PDF = Buffer.from('%PDF-1.4 search test');

describe('Search global (e2e)', () => {
  let app: INestApplication;
  let agent: any;
  let arsipIdNomor = 0;
  const uniq = `SRCH${Date.now()}`;

  beforeAll(async () => {
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

    const created = await agent
      .post('/api/arsip')
      .field('judul', `Uji Search ${uniq}`)
      .field('subbagianId', '1')
      .field('nomor', uniq)
      .attach('file', PDF, 'search.pdf');
    arsipIdNomor = created.body?.id ?? 0;
  });

  it('search mencocokkan nomor (bukan hanya judul)', async () => {
    expect(arsipIdNomor).toBeGreaterThan(0);
    const res = await agent.get(`/api/arsip?search=${uniq}`).expect(200);
    expect(res.body.items.some((a: { id: number }) => a.id === arsipIdNomor)).toBe(true);
  });

  it('search tanpa hasil → items kosong, total 0', async () => {
    const res = await agent
      .get('/api/arsip?search=zzz-tidak-ada-xyz-99999')
      .expect(200);
    expect(res.body.items).toHaveLength(0);
    expect(res.body.total).toBe(0);
  });
});

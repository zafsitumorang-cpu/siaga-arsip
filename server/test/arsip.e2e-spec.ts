import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { AppModule } from '../src/app.module';

describe('Arsip (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? 'admin';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? '';
    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD })
      .expect(201);
    const raw = Array.isArray(login.headers['set-cookie'])
      ? login.headers['set-cookie'].join(';')
      : login.headers['set-cookie'];
    token = /access_token=([^;]+)/.exec(raw)![1];
  });

  afterAll(async () => {
    await app.close();
  });

  const auth = () => ({ Cookie: `access_token=${token}` });

  it('(1) GET /api/arsip tanpa auth → 401', async () => {
    await request(app.getHttpServer()).get('/api/arsip').expect(401);
  });

  it('(2) GET /api/arsip dengan auth → 200, { items, total, page, pageSize }', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/arsip')
      .set(auth())
      .expect(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBeGreaterThan(0);
    expect(res.body).toMatchObject({
      total: expect.any(Number),
      page: 1,
      pageSize: 10,
    });
    expect(res.body.total).toBeGreaterThanOrEqual(res.body.items.length);
  });

  it('(3) pagination: page=2&pageSize=5 → hasil beda dengan page 1', async () => {
    const p1 = await request(app.getHttpServer())
      .get('/api/arsip?page=1&pageSize=5')
      .set(auth())
      .expect(200);
    const p2 = await request(app.getHttpServer())
      .get('/api/arsip?page=2&pageSize=5')
      .set(auth())
      .expect(200);
    expect(p1.body.items).toHaveLength(5);
    expect(p2.body.items).toHaveLength(5);
    expect(p2.body).toMatchObject({ page: 2, pageSize: 5 });
    expect(p1.body.items[0].id).not.toBe(p2.body.items[0].id);
  });

  it('(4) filter status=TERVERIFIKASI → semua item TERVERIFIKASI', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/arsip?status=TERVERIFIKASI')
      .set(auth())
      .expect(200);
    expect(res.body.items.length).toBeGreaterThan(0);
    for (const item of res.body.items) {
      expect(item.status).toBe('TERVERIFIKASI');
    }
  });

  it('(5) filter subbagianId → semua item subbagianId sesuai', async () => {
    const all = await request(app.getHttpServer())
      .get('/api/arsip?pageSize=1')
      .set(auth())
      .expect(200);
    const targetId = all.body.items[0].subbagianId;
    const res = await request(app.getHttpServer())
      .get(`/api/arsip?subbagianId=${targetId}`)
      .set(auth())
      .expect(200);
    expect(res.body.items.length).toBeGreaterThan(0);
    for (const item of res.body.items) {
      expect(item.subbagianId).toBe(targetId);
    }
  });

  it('(6) search → judul semua mengandung kata kunci', async () => {
    const all = await request(app.getHttpServer())
      .get('/api/arsip?pageSize=100')
      .set(auth())
      .expect(200);
    const keyword = all.body.items[0].judul.split(/\s+/)[0];
    const res = await request(app.getHttpServer())
      .get(`/api/arsip?search=${encodeURIComponent(keyword)}`)
      .set(auth())
      .expect(200);
    expect(res.body.items.length).toBeGreaterThan(0);
    for (const item of res.body.items) {
      expect(item.judul.toLowerCase()).toContain(keyword.toLowerCase());
    }
  });

  it('(7) query tidak valid (status=BUKANSTATUS) → 400', async () => {
    await request(app.getHttpServer())
      .get('/api/arsip?status=BUKANSTATUS')
      .set(auth())
      .expect(400);
  });

  it('(8) GET /api/arsip/:id → detail ArsipDto; id tidak ada → 404', async () => {
    const list = await request(app.getHttpServer())
      .get('/api/arsip?pageSize=1')
      .set(auth())
      .expect(200);
    const id = list.body.items[0].id;
    const res = await request(app.getHttpServer())
      .get(`/api/arsip/${id}`)
      .set(auth())
      .expect(200);
    expect(res.body).toMatchObject({ id, subbagianNama: expect.any(String) });
    expect(res.body.judul).toBeDefined();
    expect(res.body.status).toBeDefined();
    expect(res.body.isDigital).toBeDefined();
    expect(res.body.subbagian).toBeUndefined();

    await request(app.getHttpServer())
      .get('/api/arsip/999999')
      .set(auth())
      .expect(404);
  });
});

describe('Arsip edge cases (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? 'admin';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? '';
    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD })
      .expect(201);
    const raw = Array.isArray(login.headers['set-cookie'])
      ? login.headers['set-cookie'].join(';')
      : login.headers['set-cookie'];
    token = /access_token=([^;]+)/.exec(raw)![1];
  });

  afterAll(async () => {
    await app.close();
  });

  const auth = () => ({ Cookie: `access_token=${token}` });

  it('(e1) pageSize=5 → items.length <= 5 dan total >= 80', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/arsip?pageSize=5')
      .set(auth())
      .expect(200);
    expect(res.body.items.length).toBeLessThanOrEqual(5);
    expect(res.body.total).toBeGreaterThanOrEqual(80);
  });

  it('(e2) search=% → 200 (bukan 500)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/arsip?search=%25')
      .set(auth())
      .expect(200);
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  it("(e3) search=' → 200 (bukan 500)", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/arsip?search='")
      .set(auth())
      .expect(200);
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  it('(e4) page=999 → items: [], total tetap benar', async () => {
    const first = await request(app.getHttpServer())
      .get('/api/arsip?pageSize=5')
      .set(auth())
      .expect(200);
    const res = await request(app.getHttpServer())
      .get('/api/arsip?page=999&pageSize=5')
      .set(auth())
      .expect(200);
    expect(res.body.items).toEqual([]);
    expect(res.body.total).toBe(first.body.total);
  });

  it('(e5) pageSize=101 (> @Max(100)) → 400', async () => {
    await request(app.getHttpServer())
      .get('/api/arsip?pageSize=101')
      .set(auth())
      .expect(400);
  });

  it('(e6) pageSize=0 → 400', async () => {
    await request(app.getHttpServer())
      .get('/api/arsip?pageSize=0')
      .set(auth())
      .expect(400);
  });

  it('(e7) search tidak ada hasilnya → items: []', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/arsip?search=zzztidakadajudulsepertiinizzz')
      .set(auth())
      .expect(200);
    expect(res.body.items).toEqual([]);
    expect(res.body.total).toBe(0);
  });
});

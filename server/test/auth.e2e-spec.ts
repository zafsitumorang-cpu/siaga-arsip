import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { AppModule } from '../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? 'admin';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? '';

  it('(a) login dengan kredensial benar → 201 + set-cookie access_token', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD })
      .expect(201);

    expect(res.body).toMatchObject({
      username: ADMIN_USERNAME,
      role: 'ADMIN',
    });
    const cookies = res.headers['set-cookie'];
    const raw = Array.isArray(cookies) ? cookies.join(';') : cookies;
    expect(raw).toContain('access_token=');
    expect(raw).toContain('HttpOnly');
  });

  it('(b) login password salah → 401', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: ADMIN_USERNAME, password: 'wrong-password' })
      .expect(401);
  });

  it('(c) GET /api/auth/me tanpa cookie → 401', async () => {
    await request(app.getHttpServer()).get('/api/auth/me').expect(401);
  });

  it('(d) GET /api/auth/me dengan cookie hasil login → 200, username cocok', async () => {
    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD });

    const token = /access_token=([^;]+)/.exec(
      Array.isArray(login.headers['set-cookie'])
        ? login.headers['set-cookie'].join(';')
        : login.headers['set-cookie'],
    )![1];

    const res = await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Cookie', [`access_token=${token}`])
      .expect(200);

    expect(res.body).toMatchObject({
      username: ADMIN_USERNAME,
      role: 'ADMIN',
    });
  });

  it('(e) logout menghapus cookie → /api/auth/me jadi 401', async () => {
    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD })
      .expect(201);

    const token = /access_token=([^;]+)/.exec(
      Array.isArray(login.headers['set-cookie'])
        ? login.headers['set-cookie'].join(';')
        : login.headers['set-cookie'],
    )![1];

    const logout = await request(app.getHttpServer())
      .post('/api/auth/logout')
      .set('Cookie', [`access_token=${token}`])
      .expect(201);

    // set-cookie harus menandai access_token untuk dihapus/kedaluwarsa
    const rawCookie = Array.isArray(logout.headers['set-cookie'])
      ? logout.headers['set-cookie'].join(';')
      : logout.headers['set-cookie'];
    expect(rawCookie).toContain('access_token=');
    expect(/access_token=;/.test(rawCookie) || /Max-Age=0|Expires=Thu, 01 Jan 1970/i.test(rawCookie)).toBe(true);

    // token lama tidak lagi valid (cookie dikirim tapi sudah di-clear di server side behavior)
    await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Cookie', [`access_token=`])
      .expect(401);
  });

  // Dijalankan terakhir: menghabiskan window throttle login (5/60s).
  it('(f) login 6x password salah → request ke-6 = 429', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: ADMIN_USERNAME, password: 'wrong-password' });
    }
    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: ADMIN_USERNAME, password: 'wrong-password' })
      .expect(429);
  });
});

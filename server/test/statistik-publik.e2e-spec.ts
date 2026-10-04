import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Statistik publik (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/statistik/publik mengembalikan angka agregat tanpa auth', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/statistik/publik')
      .expect(200);

    expect(typeof res.body.total).toBe('number');
    expect(typeof res.body.terverifikasi).toBe('number');
    expect(typeof res.body.digital).toBe('number');
    expect(Object.keys(res.body).sort()).toEqual(['digital', 'terverifikasi', 'total']);
  });
});

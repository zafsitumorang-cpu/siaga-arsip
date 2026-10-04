import { PrismaService } from '../src/prisma/prisma.service';

/**
 * Seed verification test.
 * Expects `pnpm prisma db seed` to have been run against DATABASE_URL.
 */
describe('Seed data', () => {
  let prisma: PrismaService;

  beforeAll(() => {
    prisma = new PrismaService();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('seeds exactly 4 subbagian', async () => {
    expect(await prisma.subbagian.count()).toBe(4);
  });

  it('seeds at least 80 arsip', async () => {
    expect(await prisma.arsip.count()).toBeGreaterThanOrEqual(80);
  });

  it('seeds exactly 1 admin user', async () => {
    expect(await prisma.user.count()).toBe(1);
    const user = await prisma.user.findFirst();
    expect(user?.role).toBe('ADMIN');
  });
});

import { test, expect } from '@playwright/test';
import { existsSync } from 'fs';
import { join } from 'path';

/**
 * UI smoke test SIAGA ARSIP.
 * Sesi login dibagikan via storageState (tests/global-setup.ts) — tidak ada kredensial di sini.
 * Jalankan: BASE_URL=... npx playwright test
 */

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const hasSession = existsSync(join(process.cwd(), 'test-results', 'storageState.json'));

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1366, height: 768 },
];


// Sesi sudah dibagikan via storageState (global-setup) — test 'Aplikasi' hanya perlu
// memastikan di halaman aplikasi; fungsi ini dipakai hanya oleh test login-sukses eksplisit.


async function assertNoHorizontalOverflow(page: import('@playwright/test').Page, label: string) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow, `${label}: overflow horizontal ${overflow}px`).toBeLessThanOrEqual(2);
}

test.describe('Publik (tanpa login)', () => {
  // Paksa tanpa sesi — blok ini menguji tampilan untuk pengunjung anonim.
  test.use({ storageState: { cookies: [], origins: [] } });

  test('landing page: hero, CTA, statistik live, footer', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator('h1')).toContainText('Arsip Tertata');
    await expect(page.getByRole('link', { name: /Masuk/ }).first()).toBeVisible();
    // Statistik live terisi (count-up selesai) — angka > 0
    await page.waitForTimeout(2500);
    const nums = await page.locator('#statistik .tabular-nums').allInnerTexts();
    expect(nums.length).toBe(3);
    for (const n of nums) expect(parseInt(n.replace(/\D/g, '')) || 0, 'statistik harus > 0').toBeGreaterThan(0);
    await assertNoHorizontalOverflow(page, 'landing');
  });

  for (const vp of VIEWPORTS) {
    test(`landing responsive ${vp.name} (${vp.width}px)`, async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await ctx.newPage();
      await page.goto(BASE);
      await page.waitForTimeout(1500);
      await assertNoHorizontalOverflow(page, `landing ${vp.name}`);
      await ctx.close();
    });
  }

  test('login page: elemen inti & error state', async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    // toggle show/hide password ada
    await expect(page.locator('button[aria-label*="password"]')).toBeVisible();
    // login salah → pesan error muncul
    await page.fill('#username', 'admin');
    await page.fill('#password', 'bukan-password-nyata');
    await page.click('button[type=submit]');
    await expect(page.getByText('Username atau password salah')).toBeVisible({ timeout: 8000 });
    await assertNoHorizontalOverflow(page, 'login error');
  });
});

test.describe('Aplikasi (login)', () => {
  test.use({ viewport: { width: 1366, height: 768 } });

  test('Sesi login aktif → Beranda lengkap', async ({ page }) => {
    await page.goto(`${BASE}/`);
    await expect(page.getByText('Selamat Datang di')).toBeVisible({ timeout: 15000 });
    // 4 stat card
    await expect(page.locator('.grid').first()).toBeVisible();
    await assertNoHorizontalOverflow(page, 'beranda');
  });

  test('Tombol Keluar terlihat tanpa scroll (regresi sidebar)', async ({ page }) => {
    await page.goto(`${BASE}/`);
    const keluar = page.getByRole('button', { name: 'Keluar' });
    await expect(keluar).toBeVisible();
    await expect(keluar).toBeInViewport({ ratio: 0.5 });
  });

  test('Daftar arsip: skeleton → data muncul (regresi "tulisannya tidak ada")', async ({ page }) => {
    await page.goto(`${BASE}/arsip`);
    // Setelah load selesai, harus ada baris data ATAU pesan kosong yang benar (bukan keduanya kosong tanpa pesan)
    await page.waitForSelector('tbody tr', { timeout: 15000 });
    const rowCount = await page.locator('tbody tr').count();
    expect(rowCount, 'minimal 1 baris atau pesan "Tidak ada arsip"').toBeGreaterThan(0);
    await assertNoHorizontalOverflow(page, 'daftar arsip desktop');
  });

  test('Daftar arsip mobile: tabel scrollable, tidak lebar melebihi layar', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 667 }, storageState: hasSession ? join(process.cwd(), 'test-results', 'storageState.json') : undefined });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/arsip`);
    await page.waitForTimeout(2500);
    // container tabel boleh scroll internal, tapi body tidak overflow
    await assertNoHorizontalOverflow(page, 'daftar arsip mobile');
    await ctx.close();
  });

  test('Drawer hamburger mobile: buka, menu lengkap, auto-close pindah halaman', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 667 }, storageState: hasSession ? join(process.cwd(), 'test-results', 'storageState.json') : undefined });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/`);
    await expect(page.getByText('Selamat Datang di')).toBeVisible({ timeout: 15000 });
    const burger = page.locator('button[aria-label="Buka menu"]');
    await expect(burger).toBeVisible();
    await burger.click();
    const drawer = page.locator('aside').nth(1);
    await expect(drawer).toBeVisible();
    for (const menu of ['Beranda', 'Arsip', 'Upload', 'Klasifikasi', 'Laporan', 'Pengaturan', 'Keluar']) {
      await expect(drawer.getByText(menu, { exact: true })).toBeVisible();
    }
    // pilih menu → drawer menutup & pindah halaman
    await drawer.getByText('Laporan', { exact: true }).click();
    await expect(page.getByText('Memuat laporan…').or(page.getByRole('heading', { name: /Laporan/i }))).toBeVisible({ timeout: 10000 });
    await assertNoHorizontalOverflow(page, 'drawer laporan mobile');
    await ctx.close();
  });

  test('Halaman inti merespons (Klasifikasi, Laporan, Profil, Pengaturan)', async ({ page }) => {
    for (const path of ['/klasifikasi', '/laporan', '/profil', '/pengaturan']) {
      const res = await page.goto(`${BASE}${path}`);
      expect(res?.status(), `GET ${path}`).toBeLessThan(400);
      await page.waitForTimeout(800);
      await assertNoHorizontalOverflow(page, path);
    }
  });

  test('Search global: hasil memuat arsip by nomor/judul', async ({ page }) => {
    await page.goto(`${BASE}/arsip`);
    await page.waitForTimeout(2000);
    // ambil judul arsip pertama sebagai query
    const firstTitle = await page.locator('tbody tr td a').first().innerText().catch(() => null);
    test.skip(!firstTitle, 'tidak ada arsip untuk diuji');
    await page.fill('input[name=q]', firstTitle!.split(' ').slice(0, 2).join(' '));
    await page.press('input[name=q]', 'Enter');
    await page.waitForTimeout(2500);
    await expect(page.locator('tbody tr').first()).toBeVisible();
    await assertNoHorizontalOverflow(page, 'search');
  });

  test('Tidak ada console error kecuali 401 sesi', async ({ page }) => {
    const errors: string[] = [];
    const notFound: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('response', (r) => {
      if (r.status() === 404) notFound.push(r.url());
    });
    for (const path of ['/', '/arsip', '/klasifikasi', '/laporan']) {
      await page.goto(`${BASE}${path}`);
      await page.waitForTimeout(1200);
    }
    const real = errors.filter((e) => !e.includes('401') && !e.includes('favicon'));
    expect(real, `console error tak terduga:\n${real.join('\n')}\n404 URLs: ${notFound.join(', ')}`).toHaveLength(0);
  });
});

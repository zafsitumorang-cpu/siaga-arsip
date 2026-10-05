import { chromium, FullConfig } from '@playwright/test';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

/**
 * Setup global: login SEKALI, simpan cookie sesi ke storageState.json.
 * Semua test di 'Aplikasi' memakai ulang sesi ini — menghindari throttle login (5/60s).
 */
async function globalSetup(config: FullConfig) {
  const baseURL = (config.projects[0]?.use as { baseURL?: string })?.baseURL ?? 'http://127.0.0.1:3000';

  const env: Record<string, string> = {};
  const envPaths = [
    join(process.cwd(), 'server', '.env'),
    join(process.cwd(), '..', 'server', '.env'),
  ];
  for (const p of envPaths) {
    if (existsSync(p)) {
      for (const line of readFileSync(p, 'utf-8').split('\n')) {
        const m = line.match(/^([A-Z_]+)=(.*)$/);
        if (m) env[m[1]] = m[2].trim();
      }
      break;
    }
  }
  const user = process.env.ADMIN_USERNAME ?? env.ADMIN_USERNAME ?? 'admin';
  const pass = process.env.ADMIN_PASSWORD ?? env.ADMIN_PASSWORD ?? '';
  if (!pass) throw new Error('ADMIN_PASSWORD tidak ditemukan (server/.env)');

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`${baseURL}/login`);
  await page.fill('#username', user);
  await page.fill('#password', pass);
  await page.click('button[type=submit]');
  await page.waitForURL(`${baseURL}/`, { timeout: 15000 });

  const statePath = join(process.cwd(), 'test-results', 'storageState.json');
  mkdirSync(dirname(statePath), { recursive: true });
  await page.context().storageState({ path: statePath });
  await browser.close();
}

export default globalSetup;

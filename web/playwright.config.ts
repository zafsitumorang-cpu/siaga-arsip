import { defineConfig } from '@playwright/test';
import { existsSync } from 'fs';
import { join } from 'path';

const storageStatePath = join(process.cwd(), 'test-results', 'storageState.json');
const hasSession = existsSync(storageStatePath);

export default defineConfig({
  testDir: './tests',
  timeout: 45000,
  retries: 0,
  workers: 1,
  globalSetup: './tests/global-setup.ts',
  use: {
    baseURL: process.env.BASE_URL ?? 'http://127.0.0.1:3000',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    storageState: hasSession ? storageStatePath : undefined,
  },
  reporter: [['list']],
});

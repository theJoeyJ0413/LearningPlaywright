import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });


export default defineConfig({
  testDir: './tests', // 测试文件存放的目录
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never', onlyFailures: !!process.env.CI }],
  ],
  use: {
    baseURL: 'https://demo.playwright.dev', // 用例写 page.goto('/todomvc')
    trace: 'on-first-retry', // Collect trace when retrying the failed test
    screenshot: 'only-on-failure', // Take screenshot only when test fails
    video: 'retain-on-failure', // Record video only when test fails
  },

  projects: [
    // 本地默认只跑 chromium
    // CI 使用 --project=* 跑全量
    // 不止换浏览器，还能跑不同 baseURL、不同登录态、移动端模拟
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      default: false
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      default: false
    },
  ],

  /* 本地使用 webServer 自动起服务 */
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:5173',
  //   reuseExistingServer: !process.env.CI,
  // },
});

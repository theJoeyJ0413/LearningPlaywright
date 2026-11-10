/**
 * test(name, fn) 一个用例 = 一个独立场景
 */

import { test, expect } from '@playwright/test';

test('首页标题包含 Playwright', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});

test('能进入 Installation 页面', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('导航栏是否存在 Docs 链接', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page.getByRole('link', { name: 'Docs' })).toBeVisible();
});

test('点击 Docs，判断URL包含/docs/', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await page.getByRole('link', { name: 'Docs' }).click();
  await expect(page).toHaveURL(/.*docs.*/);
});

test(' VS Code 标题可见', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await page.getByRole('link', { name: 'VS Code' }).click();
  await expect(page.getByRole('heading', { name: 'VS Code' })).toBeVisible();
});

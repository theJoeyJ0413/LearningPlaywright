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

test('点击左侧菜单 VS Code 后显示对应标题', async ({ page }) => {
  await page.goto('https://playwright.dev/docs/intro');

  // 左侧菜单是 aria-label="Docs sidebar" 的 nav，先缩小查找范围
  // name 用 exact，忽略大小写的子串匹配，避免命中 "Using the VS Code Extension"
  const sidebar = page.getByRole('navigation', { name: 'Docs sidebar' });
  await sidebar.getByRole('link', { name: 'VS Code', exact: true }).click();

  // 点击是客户端路由跳转，下面两个断言会自动重试，不需要手动等待
  await expect(page).toHaveURL(/\/docs\/getting-started-vscode$/);
  await expect(page.getByRole('heading', { level: 1, name: 'VS Code' })).toBeVisible();
});

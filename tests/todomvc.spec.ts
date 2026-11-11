/**
 * 被测对象：https://demo.playwright.dev/todomvc
 */

import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page}) => {
    await page.goto('https://demo.playwright.dev/todomvc');
})

test('新增待办', async ({ page}) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Playwright');
    await input.press('Enter');
    // 前端有写 data-testid
    await expect(page.getByTestId('todo-title')).toHaveText(['Playwright']);
});

test('编辑待办', async ({ page}) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('PlaywrightLearning');
    await input.press('Enter');
    const edit = page.getByTestId('todo-title').locator('text=PlaywrightLearning');
    await edit.dblclick();

    const editInput = page.getByTestId('todo-title').locator('text=PlaywrightLearning');
    await editInput.press('End'); // 光标移动到末尾（可选）
    await editInput.pressSequentially('added');
    await editInput.press('Enter');
    await expect(page.getByTestId('todo-title')).toHaveText(['PlaywrightLearningadded']);
});

test('完成待办并进入 Completed 列表', async ({ page}) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('test');
    await input.press('Enter');
    await page.getByRole('checkbox', { name: 'Toggle Todo'}).check();
    await page.getByRole('link', { name: 'Completed' }).click();
    await expect(page.getByTestId('todo-title')).toHaveText(['test']);
});

test('删除待办', async ({ page}) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('test Delete');
    await input.press('Enter');

    const item = page.getByTestId('todo-title').locator('text=test Delete');
    await item.hover();
    await page.getByRole('button', { name: 'Delete'}).click();
    await expect(page.getByTestId('todo-title')).toHaveCount(0);
});

test('一键完成', async ({ page}) => {
    const todos = ['test1', 'test2', 'test3'];
    const input = page.getByPlaceholder('What needs to be done?');

    for (const todo of todos) {
        await test.step(`新增待办: ${todo}`, async () => {
            await input.fill(todo);
            await input.press('Enter');
        });  
    }

    await expect(page.getByTestId('todo-count')).toHaveText('3 items left');

    const toggleAll = page.getByRole('checkbox', { name: 'Mark all as complete' });
    await expect(toggleAll).toBeVisible();
    await toggleAll.check();
    await expect(page.getByTestId('todo-count')).toHaveText('0 items left');
});
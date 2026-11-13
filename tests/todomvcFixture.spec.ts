import { test, expect } from '../fixtures';

test('新增待办', async ({ todoPage, page }) => {
    await todoPage.addToDo('buy milk');
    //await expect(page.getByTestId('todo-title')).toContainText(['写测试', 'buy milk']);
    await todoPage.expectItems(['写测试', 'buy milk']);
});

test('编辑待办', async ({ todoPage, page }) => {
    await todoPage.editTodo('Playwright', '123');
    await todoPage.expectItems(['写测试', 'Playwright123']);
});

test('删除待办', async ({ todoPage, page }) => {
    await todoPage.deleteTodo('写测试');
    await todoPage.expectCount(0);
});

test('完成待办并进入 Completed 列表', async ({ todoPage, page }) => {
    await todoPage.checkButton.check();
    await todoPage.completedLink.click();
    await todoPage.expectItems(['写测试']);
});

test('一键完成', async ({ todoPage, page }) => {
    const todos = ['test1', 'test2', 'test3'];
    for (const todo of todos) {
        await test.step(`新增待办: ${todo}`, async () => {
            await todoPage.addToDo(todo);
        });
    }
    await expect(todoPage.todocount).toHaveText('4 items left');
    await expect(todoPage.toggleAllButton).toBeVisible();
    await todoPage.toggleAllButton.check();
    await expect(todoPage.todocount).toHaveText('0 items left');
});
import { expect, type Locator, type Page } from '@playwright/test';

export class TodoPage {

    // 私有化细节
    // readonly 表示赋值后不再改指向
    private readonly inputBox: Locator;
    private readonly todoItems: Locator;
    private readonly editBox: Locator;
    private readonly deleteButton: Locator;
    readonly checkButton: Locator;
    readonly completedLink: Locator;
    readonly todocount: Locator;
    readonly toggleAllButton: Locator;

    // 构造体：把定位元素固化，直接在方法里复用
    // 参数 public readonly page: Page 等价于声明 page 字段 + this.page = page
    // 在测试里可以直接使用 todoPage.page 访问 Page 对象，所以 public
    constructor(public readonly page: Page) {
        this.inputBox = page.getByPlaceholder('What needs to be done?');
        this.todoItems = page.getByTestId('todo-item');
        this.editBox = page.getByTestId('todo-title');
        this.deleteButton = page.getByRole('button', { name: 'Delete' });
        this.checkButton = page.getByRole('checkbox', { name: 'Toggle Todo' });
        this.completedLink = page.getByRole('link', { name: 'Completed' });
        this.todocount = page.getByTestId('todo-count');
        this.toggleAllButton = page.getByRole('checkbox', { name: 'Mark all as complete' });
    }

    async goto() {
        // 此处因为已经在 playwright.config.ts 里配置了 baseURL，所以可以直接写相对路径
        await this.page.goto('/todomvc');
    }

    async addToDo(text: string) {
        await this.inputBox.fill(text);
        await this.inputBox.press('Enter');
    }

    async expectItems(texts: string[]) {
        await expect(this.todoItems.getByTestId('todo-title')).toHaveText(texts);
    }

    async editTodo(text1: string, text2: string) {
        await this.addToDo(text1);
        const edit = this.editBox.locator(`text=${text1}`);
        await edit.dblclick();
        const editInput = this.editBox.locator(`text=${text1}`);
        await editInput.press('End'); // 光标移动到末尾（可选）
        await editInput.pressSequentially(text2);
        await editInput.press('Enter');
    }

    async deleteTodo(text: string) {
        const item = this.editBox.locator(`text=${text}`);
        await item.hover();
        await this.deleteButton.click();
    }

    async expectCount(number: number) {
        await expect(this.todoItems).toHaveCount(number);
    }

}
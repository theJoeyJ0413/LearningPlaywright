// 把官方的 test 起个别名 base，避免和下方新定义的 test 冲突
import { test as base } from '@playwright/test';
// 导入页面对象
import {TodoPage} from './pages/todo-page';

// 1. 声明类型
type MyFixtures = {
    todoPage: TodoPage;
};

// 2. 扩展 test

// extend() 返回一个新的 test 对象
export const test = base.extend<MyFixtures>({

    // async (依赖, use, 元信息) => { ... }
    // 其中依赖是指该 fixture 依赖的其他 fixture；
    // use是一个函数，将fixture的值传给测试用例；
    // 元信息是指测试用例的描述信息
    todoPage: async ({ page }, use) => {

        const todoPage = new TodoPage(page);
        await todoPage.goto();
        await todoPage.addToDo('写测试');

        // 时间分界线
        // 之前是 setup，之后是 teardown
        await use(todoPage);
    },
});

// 3. 一定要导出 expect
export { expect } from '@playwright/test';
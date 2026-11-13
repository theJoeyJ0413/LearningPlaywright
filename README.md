🔗 https://playwright.dev/docs/intro

### DAY 1

1. 安装官方脚手架

   ```
   cd LearningPlaywright
   npm init playwright@latest
   ```

   当前项目结构会变化为：

   ```
   LearningPlaywright/
   ├── .github/
   ├── node_modules/
   ├── tests/
   │  └── example.spec.ts      # 最小示例
   ├── .gitignore
   ├── package-lock.json
   ├── package.json
   └── playwright.config.ts    # 全局配置：浏览器、超时、重试、报告
   ```

   除此之外，还同时安装好 Chromium / Firefox / WebKit 三个内核

2. 跑通示例

   ```
   npx playwright test
   ```

   - 默认 **headless in parallel**
   - 在 `playwright.config.ts` 中配置浏览器内核
   - `npx playwright test --headed` 显示浏览器窗口
   - `npx playwright test --project=chromium` 只在一个浏览器内核上运行
   - `npx playwright test tests/example.spec.ts` 只运行一个文件
   - `npx playwright test --ui` UI Mode
   - `npx playwright test show-report` 打开 HTML 报告

3. 理解`tests/example.spec.ts`
   - **`test(name, fn)`** = 一个用例 = 一个独立场景
   - **自动等待**：`click()` 前自动等元素可交互，断言自动重试到超时
   - **用例之间天然隔离`page` fixture**：每个用例一份全新浏览器上下文（相当于全新无痕窗口）

### DAY 2：定位器+动作+断言+调试

1. 定位器：优先面向用户定位
   优先级：`getByRole > getByLabel > getByPlaceholder > getByText > getByAltText > getByTestId`

2. 常用动作
   - `goto`
   - `fill`、`press`、`click`、`check`、`hover`等

   > 不需要写显式等待。
   > **可操作性检查（actionability check）**：点击前自动等元素存在、可见、稳定、可接收事件、未被遮挡

3. 断言
   1. `web-first`断言：自动重试直到满足或超时
      `await expect(page).toHaveTitle(/Playwright/);`
      `await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();`
      `await expect(page.getByTestId('todo-title')).toHaveText(['学习定位器']);`
   2. 普通断言：同步、只查一次。适用于校验已拿到的普通值
      `expect(1 + 1).toBe(2)`

4. Codegen 录制
   `npx playwright codegen demo.playwright.dev/todomvc`
   - 被测对象：`https://demo.playwright.dev/todomvc`

5. 调试
   > 先看报错的 expected / received → 再开 UI Mode 定位到那一步 → 最后才怀疑环境
   1. UI Mode
      `npx playwright test --ui` 看每一步执行
   2. Inspector
      `npx playwright test --debug` 单步执行，边看 DOM 边改定位器
   3. Trace
      `npx playwright test --trace on-first-retry` CI 失败后复盘：动作前后 DOM 快照、网络、Console

其他：

- 输入的几种选择
  1. `fill(test)`清空+设值
  2. `pressSequentially(text)`逐字符（keydown-input-keyup），追加文本
  3. `clear()` 只清空

### DAY 3: 配置+工程化+ CI

1. 理解 `playwright.config.ts` 配置
   🔗：https://playwright.dev/docs/test-configuration

2. `fixture` 组织测试

   > fixture 名字必须以字母或下划线开头，只含字母、数字、下划线

   先直观了解当前代码的fixture在哪里：`test("新增待办", async ({ page }) => {});`其中的`{ page }`是一个内置的`fixture`，告知 Playwright Test 建立一个`page` 类型的 `fixture`，并用于当前的测试，表示是当前用例独享的页面。

   那么，如何自定义 `fixture`？结合当前项目，进行修改：
    1. 新建文件夹 `pages`，并在其下新建文件 `pages.ts`，定义 `TodoPage`页面对象
    2. 在 `tests/fixtures/`下新建文件 `fixtures.ts`，并导入 `TodoPage` 页面对象

        2.1 定义类型 `type MyFixtures = {...}`

        2.2 扩展 `export const test = base.extend<MyFixtures>({...})`

        2.3 导出 `export { expect } from '@playwright/test'`
    3. 新建测试文件 `tests/todomvcFixture.spec.ts` 并 `import { test, expect } from './fixtures'`

    以上是单文件形式的 `fixture`定义，文件名没有必须限定，测试运行时只认对应文件里的`import`，不会特定去扫描某个特定文件名的文件

    如果想以多文件形式管理 `fixture`，大致做法是：新建 `fixtures` 文件夹 - 新建 `index.ts`文件，必需 - 新建 `core.ts` 等子 `fixture` 文件 - 在 `index.ts` 文件中导入`import { test as coreTest } from './core';`各子`fixture`并做合并 `mergeTests` 和 `export` - 测试文件中`import { test, expect } from '../fixtures';`即可  

3. `Page Object Model`：页面结构变化只改一个文件

    在页面文件中定义：元素定位信息、页面基本操作方法、部分可选的断言等，在测试中直接将操作串起来


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
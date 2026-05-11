# STM32 定时器计算器

基于 `STM32Calculator.xlsx` 重做的静态网页版本，适合直接在浏览器里做 STM32 定时器参数估算。

## 文件

- `index.html`：页面入口
- `style.css`：样式
- `app.js`：计算逻辑
- `STM32Calculator.xlsx`：原始工作簿

## 使用

直接双击打开 `index.html`，或在当前目录启动任意静态文件服务器后访问。

## GitHub Pages

- 已添加工作流：`.github/workflows/deploy-pages.yml`
- 推送到 `main` 后会自动部署静态站点
- 仓库 Pages Source 需要设置为 `GitHub Actions`
- 默认访问地址通常是 `https://kyro-qu.github.io/STM32Calculator/`

## 计算范围

- APB 定时器时钟、PSC、ARR、CCR
- 定时器时钟频率、计数时间、周期、频率
- PWM 占空比
- 高级定时器 `DTG[7:0]` 死区时间

## 说明

- 网页默认值与 Excel 当前默认值一致。
- 芯片预设来自工作簿中的常见芯片与时钟值，仅用于快速回填。
- 页面把原表中容易混淆的 `TIM_Period / TIM_Prescaler` 备注改成了直接显示 `PSC`、`ARR` 寄存器值。
- 占空比继续沿用 Excel 原公式，以保证网页结果和工作簿结果一致。

# STM32 定时器计算器

基于 `STM32Calculator.xlsx` 重做的静态网页版本，适合直接在浏览器中估算 STM32 定时器参数。

## 文件

- `index.html`：页面入口
- `style.css`：页面样式
- `app.js`：计算逻辑与交互
- `STM32Calculator.xlsx`：原始工作簿
- `.github/workflows/deploy-pages.yml`：GitHub Pages 自动部署工作流

## 使用

直接双击打开 `index.html`，或在当前目录启动任意静态文件服务器后访问。

## 当前功能

- 定时器基础参数计算：`TIMxCLK`、`PSC`、`ARR`、`CCR`
- 定时器时钟来源切换：针对部分系列区分 `APB1` / `APB2` 定时器
- 输出周期、输出频率、计数时间、高电平时间、PWM 占空比
- 占空比口径切换：`硬件准确` 与 `Excel legacy`
- 高级定时器 `DTG[7:0]` 死区时间与二进制拆分
- 常见 STM32 型号预设，并按系列分组显示，补充更多 `STM32H7` 型号
- 目标频率反推：根据目标 `Hz` 回填一组接近的 `PSC / ARR`
- 代码片段生成：快速复制 HAL / CubeMX 常用初始化参数
- 本地自动保存最近一次输入

## 预设说明

- 预设值是常见 `TIMxCLK` 起点，目的是减少手工录入，不代表你的工程实际值。
- 同一型号在不同 RCC 配置、不同 APB 分频下，定时器时钟可能不同。
- 页面保留时钟来源选择和手工修改入口，最终请以你的时钟树与参考手册为准。
- 对 `STM32H750` 这类高性能系列，页面预设采用更合理的定时器时钟起点，而不是直接拿 CPU 主频代入。

## GitHub Pages

- 已添加工作流：`.github/workflows/deploy-pages.yml`
- 推送到 `main` 后会自动部署静态站点
- 仓库 Pages Source 需要设置为 `GitHub Actions`
- 默认访问地址通常是 `https://kyro-qu.github.io/STM32Calculator/`

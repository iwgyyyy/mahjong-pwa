# Mahjong PWA

一个基于 Next.js 16 的立直麻将工具站，当前包含番符计算、PT 计算和规则文档三部分。

线上地址：

```text
https://mahjong.onedigi.cn
```

## 功能

- `/calculator`
  立直麻将番符计算器。支持场况条件、门前手牌、副露、和了牌、宝牌指示牌、里宝牌指示牌录入，并实时计算役种、番数、符数和基础点。
- `/pt`
  日麻 PT 计算器。输入四家终局点数后，按常见的 `25000 起点 / 30000 返点 / 20-10 马` 规则换算 PT，也支持修改规则参数。
- `/docs`
  立直麻将规则文档。包含基础规则、鸣牌与流局、振听、符数与点数快捷表，以及常见役种 / 役满图例。

## 技术栈

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- react-hook-form + zod
- next-themes

## 本地开发

项目使用 `bun` 作为包管理器。

安装依赖：

```bash
bun install
```

启动开发环境：

```bash
bun run dev
```

访问：

```text
http://localhost:3000
```

## 常用命令

```bash
bun run dev
bun run build
bun run start
bun run lint
npx tsc --noEmit
```

## 项目结构

```text
app/
  page.tsx              首页
  calculator/page.tsx   番符计算器
  pt/page.tsx           PT 计算器
  docs/page.tsx         规则文档

components/
  calculator/           计算器页面组件
  docs/                 文档图片与放大查看组件
  pt/                   PT 页面组件
  providers/            全局 provider
  ui/                   shadcn/ui 组件

lib/
  docs/                 文档数据
  mahjong/              麻将计算逻辑
```

## 当前特性

- 统一牌池校验，手牌、副露、和了牌、宝牌、里宝共用剩余张数
- 移动端抽屉式选牌键盘
- 文档图片支持点击放大
- 暗夜模式默认跟随系统主题

## 注意事项

- 这是前端工具项目，规则与点数逻辑以当前实现为准
- 当前未包含赤宝牌计算
- 浏览器安装型 PWA 能力还没有完整接入 `manifest` 和 `service worker`

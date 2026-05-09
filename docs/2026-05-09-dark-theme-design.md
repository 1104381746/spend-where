# 记账本小程序 · 深色主题设计方案

> 日期: 2026-05-09

## 概述

为现有的微信记账本小程序实现"深邃蓝黑"深色主题，将整个应用的配色体系从浅色切换为深色。

---

## 颜色变量系统

### 品牌色（保持不变）
```css
--primary-color:  #07C160   /* 主色调、收入颜色 */
--expense-color:  #FF4757   /* 支出颜色（比原 #EE0A24 提亮以适应深色背景） */
```

### 背景层级（从深到浅）
```css
--bg-color:       #0D0D1D   /* 页面主背景 */
--card-bg:        #1A1A36   /* 卡片、区块背景 */
--card-hover:     #222244   /* 悬浮/选中态 */
--tabbar-bg:      #0A0A18   /* TabBar 背景 */
--nav-bg:         #0D0D1D   /* 导航栏背景 */
```

### 文字层级
```css
--text-primary:   #E0E0F0   /* 主文字 */
--text-secondary: #9898C0   /* 次要文字 */
--text-hint:      #6868A0   /* 提示文字 */
```

### 装饰
```css
--border-color:   rgba(255,255,255,0.06)
--shadow-color:   rgba(0,0,0,0.3)
--overlay-bg:     rgba(0,0,0,0.6)
```

---

## 要修改的文件

### 1. `style/variables.wxss`
所有颜色变量替换为上述深色值。

### 2. `app.json`
- `window.navigationBarBackgroundColor` → `#0D0D1D`
- `window.navigationBarTextStyle` → `"white"`
- `tabBar.selectedColor` → `#07C160`
- `tabBar.color` → `#6868A0`
- `tabBar.borderStyle` → `"black"`

### 3. `app.wxss`
- `page` 背景色 → `var(--bg-color)`

### 4. 各页面 WXSS 文件
逐一检查并替换硬编码颜色值。

### 5. 组件 WXSS 文件
色值替换 + 文字色微调。

### 6. 统计页日历热力色阶
替换为深色版本。

---

## 不变的部分
- 页面结构（WXML）无需修改
- 分类图标、emoji 无需修改
- ECharts 图表逻辑不变
- 云函数不变

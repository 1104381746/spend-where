# 深色主题实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将记账本小程序从浅色主题切换为"深邃蓝黑"深色主题

**Architecture:** 通过替换 CSS 变量值 + 修复各页面/组件中的硬编码颜色来实现。所有页面结构（WXML）不变，只修改样式文件（wxss）和少量 JS 中的颜色值

**Tech Stack:** 微信小程序（WXSS / CSS 自定义属性）

---

### Task 1: 更新全局颜色变量

**Files:**
- Modify: `style/variables.wxss:1-34`

- [ ] **Step 1: 替换所有颜色变量值**

编辑 `style/variables.wxss`，将所有颜色变量替换为深色主题值：

```css
page {
  /* 颜色变量 */
  --primary-color: #07C160;
  --income-color: #07C160;
  --expense-color: #FF4757;

  --bg-color: #0D0D1D;
  --card-bg: #1A1A36;
  --text-primary: #E0E0F0;
  --text-secondary: #9898C0;
  --text-hint: #6868A0;
  --border-color: rgba(255, 255, 255, 0.06);

  /* 字体大小（不变） */
  --font-size-xxl: 36rpx;
  --font-size-xl: 32rpx;
  --font-size-lg: 30rpx;
  --font-size-base: 28rpx;
  --font-size-sm: 24rpx;
  --font-size-xs: 20rpx;

  /* 间距（不变） */
  --spacing-lg: 32rpx;
  --spacing-base: 24rpx;
  --spacing-sm: 16rpx;
  --spacing-xs: 8rpx;

  /* 圆角（不变） */
  --radius-lg: 16rpx;
  --radius-base: 12rpx;
  --radius-sm: 8rpx;

  /* 阴影 */
  --shadow-card: 0 2rpx 12rpx rgba(0, 0, 0, 0.3);
}
```

- [ ] **Step 2: 提交**

```bash
git add style/variables.wxss && git commit -m "style: 更新全局颜色变量为深色主题"
```

---

### Task 2: 更新 app.json 配置

**Files:**
- Modify: `app.json:11-21`

- [ ] **Step 1: 修改导航栏和 TabBar 颜色**

编辑 `app.json`：

```json
{
  "window": {
    "backgroundColor": "#0D0D1D",
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#0D0D1D",
    "navigationBarTitleText": "记账本",
    "navigationBarTextStyle": "white"
  },
  "tabBar": {
    "color": "#6868A0",
    "selectedColor": "#07C160",
    "backgroundColor": "#0A0A18",
    "borderStyle": "black",
    ...
  }
}
```

其他项（pages, list, usingComponents）保持不变。

- [ ] **Step 2: 提交**

```bash
git add app.json && git commit -m "style: 更新导航栏和 TabBar 颜色为深色主题"
```

---

### Task 3: 更新全局样式

**Files:**
- Modify: `app.wxss`

app.wxss 已经使用了 `var(--bg-color)`，不需要改内容。但 `app.json` 改为了 `navigationBarTextStyle: "white"`，页面顶部状态栏文字将变为白色适配深色背景。

- [ ] **Step 1: 确认无需修改**

```bash
echo "app.wxss 已使用 CSS 变量，无需修改"
```

- [ ] **Step 2: 提交**

```bash
git add app.json && git commit -m "style: 适配深色主题导航栏文字样式"
```

---

### Task 4: 更新首页样式

**Files:**
- Modify: `pages/index/index.wxss:1-208`

- [ ] **Step 1: 替换所有硬编码颜色**

需替换的颜色值：

| 原色 | 替换为 | 位置 |
|------|--------|------|
| `#F5F5F5` | `var(--bg-color)` | `.page` background, `.date-header` background |
| `#FFFFFF` | `var(--card-bg)` | `.nav-arrow` background, `.date-group` background, `.modal-content` background |
| `#333` / `#333333` | `var(--text-primary)` | `.nav-arrow` color, `.month-title` color, `.modal-title` color 等 |
| `#666` / `#666666` | `var(--text-secondary)` | `.date-label`, `.empty-text`, `.modal-body`, `.modal-btn.cancel` color |
| `#999` / `#999999` | `var(--text-hint)` | `.empty-hint`, `.load-more`, `.no-more` color |
| `#F0F0F0` | `var(--border-color)` | `.nav-arrow:active` background, `.modal-actions`/`.modal-btn.cancel` border |
| `rgba(0,0,0,0.5)` 遮罩 | `var(--overlay-bg)` | `.modal-overlay` background |

编辑 `pages/index/index.wxss`：

```css
.page {
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-color);
}

/* 月份导航 */
.month-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16rpx 32rpx;
  gap: 32rpx;
}

.nav-arrow {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: var(--card-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  color: var(--text-primary);
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.3);
}

.nav-arrow:active {
  background: var(--card-hover);
}

.month-title {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--text-primary);
  min-width: 180rpx;
  text-align: center;
}

.card-wrapper {
  flex-shrink: 0;
}

.list-container {
  flex: 1;
  overflow: hidden;
}

.scroll-view {
  height: 100%;
}

.date-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 32rpx 10rpx;
  background: var(--bg-color);
}

.date-label {
  font-size: 24rpx;
  font-weight: 600;
  color: var(--text-secondary);
}

.date-summary {
  display: flex;
  gap: 16rpx;
}

.day-income {
  font-size: 22rpx;
  font-weight: 600;
  color: var(--income-color);
}

.day-expense {
  font-size: 22rpx;
  font-weight: 600;
  color: var(--expense-color);
}

.date-group {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  margin: 0 24rpx 16rpx;
  overflow: hidden;
  box-shadow: var(--shadow-card);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 28rpx;
  color: var(--text-secondary);
  margin-bottom: 8rpx;
}

.empty-hint {
  font-size: 24rpx;
  color: var(--text-hint);
}

.load-more, .no-more {
  text-align: center;
  padding: 24rpx;
  font-size: 24rpx;
  color: var(--text-hint);
}

/* FAB 按钮 */
.fab {
  position: fixed;
  right: 32rpx;
  bottom: 140rpx;
  width: 100rpx;
  height: 100rpx;
  background: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(7, 193, 96, 0.4);
  z-index: 100;
}

.fab:active {
  opacity: 0.8;
}

.fab-icon {
  font-size: 52rpx;
  color: #FFFFFF;
  line-height: 1;
}

/* 删除确认弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--overlay-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 560rpx;
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.modal-title {
  text-align: center;
  font-size: 32rpx;
  font-weight: 600;
  color: var(--text-primary);
  padding: 40rpx 32rpx 16rpx;
}

.modal-body {
  text-align: center;
  font-size: 28rpx;
  color: var(--text-secondary);
  padding: 0 32rpx 32rpx;
}

.modal-actions {
  display: flex;
  border-top: 1rpx solid var(--border-color);
}

.modal-btn {
  flex: 1;
  text-align: center;
  padding: 24rpx;
  font-size: 30rpx;
}

.modal-btn.cancel {
  color: var(--text-secondary);
  border-right: 1rpx solid var(--border-color);
}

.modal-btn.confirm {
  color: var(--expense-color);
  font-weight: 600;
}
```

- [ ] **Step 2: 提交**

```bash
git add pages/index/index.wxss && git commit -m "style: 更新首页样式为深色主题"
```

---

### Task 5: 更新记账页样式

**Files:**
- Modify: `pages/add/index.wxss:1-117`

- [ ] **Step 1: 替换所有硬编码颜色**

编辑 `pages/add/index.wxss`：

```css
.page {
  min-height: 100vh;
  background: var(--bg-color);
  padding-bottom: 40rpx;
}

.amount-section {
  background: var(--card-bg);
  padding: 48rpx 32rpx 32rpx;
  text-align: center;
}

.amount-label {
  font-size: 24rpx;
  color: var(--text-hint);
  margin-bottom: 16rpx;
}

.amount-input-wrapper {
  display: flex;
  align-items: baseline;
  justify-content: center;
}

.amount-currency {
  font-size: 40rpx;
  font-weight: 700;
  color: var(--text-primary);
  margin-right: 8rpx;
}

.amount-input {
  font-size: 56rpx;
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
  width: 300rpx;
}

.type-switcher {
  display: flex;
  background: var(--card-bg);
  padding: 0 32rpx 32rpx;
  gap: 20rpx;
  justify-content: center;
}

.type-btn {
  flex: 1;
  max-width: 200rpx;
  padding: 12rpx 0;
  text-align: center;
  border-radius: 40rpx;
  font-size: 28rpx;
  background: rgba(255,255,255,0.06);
  color: var(--text-secondary);
}

.type-btn.active-expense {
  background: rgba(255, 71, 87, 0.15);
  color: #FF4757;
  font-weight: 600;
}

.type-btn.active-income {
  background: rgba(7, 193, 96, 0.15);
  color: #07C160;
  font-weight: 600;
}

.section {
  background: var(--card-bg);
  margin-top: 16rpx;
  padding: 24rpx 32rpx;
}

.section-title {
  font-size: 26rpx;
  color: var(--text-secondary);
  margin-bottom: 20rpx;
  font-weight: 500;
}

.picker-value {
  font-size: 28rpx;
  color: var(--text-primary);
  padding: 8rpx 0;
}

.note-input {
  font-size: 28rpx;
  color: var(--text-primary);
  padding: 8rpx 0;
  width: 100%;
}

.save-section {
  margin: 60rpx 32rpx 0;
}

.save-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background: var(--primary-color);
  color: #FFFFFF;
  font-size: 32rpx;
  font-weight: 600;
  border-radius: 44rpx;
  text-align: center;
  border: none;
}

.save-btn.disabled {
  opacity: 0.6;
}
```

- [ ] **Step 2: 提交**

```bash
git add pages/add/index.wxss && git commit -m "style: 更新记账页样式为深色主题"
```

---

### Task 6: 更新统计页样式

**Files:**
- Modify: `pages/stats/index.wxss:1-360`

- [ ] **Step 1: 替换所有硬编码颜色**

编辑 `pages/stats/index.wxss`：

```css
.page {
  min-height: 100vh;
  background: var(--bg-color);
  padding-bottom: 40rpx;
}

/* 月/年/日历 切换 */
.view-switcher {
  display: flex;
  justify-content: center;
  padding: 24rpx 0 12rpx;
  background: var(--card-bg);
}

.view-btn {
  padding: 12rpx 36rpx;
  font-size: 28rpx;
  color: var(--text-secondary);
  border: 1rpx solid rgba(255,255,255,0.1);
}

.view-btn.active {
  background: var(--primary-color);
  color: #FFFFFF;
  border-color: var(--primary-color);
}

/* 日期导航 */
.date-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 24rpx;
  background: var(--card-bg);
  border-bottom: 1rpx solid var(--border-color);
}

.nav-btn {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: rgba(255,255,255,0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  color: var(--text-primary);
  line-height: 1;
}

.nav-btn:active { background: var(--card-hover); }

.nav-label {
  font-size: 30rpx;
  font-weight: 700;
  color: var(--text-primary);
}

/* 汇总卡片 */
.summary-cards {
  display: flex;
  margin: 20rpx 24rpx;
  gap: 12rpx;
}

.summary-item {
  flex: 1;
  background: var(--card-bg);
  border-radius: var(--radius-base);
  padding: 24rpx 16rpx;
  text-align: center;
  box-shadow: var(--shadow-card);
}

.summary-item.income .summary-value { color: var(--income-color); }
.summary-item.expense .summary-value { color: var(--expense-color); }
.summary-item.balance .summary-value { color: var(--text-primary); }

.summary-label {
  font-size: 24rpx;
  color: var(--text-hint);
  margin-bottom: 8rpx;
}

.summary-value {
  font-size: 32rpx;
  font-weight: 700;
}

/* 图表区域 */
.chart-section {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  margin: 20rpx 24rpx;
  padding: 28rpx 24rpx 24rpx;
  box-shadow: var(--shadow-card);
}

.chart-title {
  font-size: 28rpx;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16rpx;
  padding-left: 4rpx;
}

.chart-hint {
  font-size: 22rpx;
  font-weight: 400;
  color: var(--text-hint);
  margin-left: 12rpx;
}

.chart-wrap {
  width: 100%;
  height: 440rpx;
}

.chart-wrap.pie-wrap {
  height: 480rpx;
}

.chart-canvas {
  width: 100%;
  height: 100%;
}

/* 日历 */
.calendar-card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  margin: 20rpx 24rpx;
  padding: 24rpx 16rpx 16rpx;
  box-shadow: var(--shadow-card);
}

.weekday-row {
  display: flex;
  margin-bottom: 8rpx;
}

.weekday-item {
  flex: 1;
  text-align: center;
  font-size: 24rpx;
  font-weight: 600;
  color: var(--text-hint);
  padding: 8rpx 0;
}

.calendar-grid {
  display: flex;
  flex-direction: column;
}

.calendar-row {
  display: flex;
}

.calendar-cell {
  flex: 1;
  height: 90rpx;
  padding: 3rpx;
  box-sizing: border-box;
}

.calendar-cell.empty {
  visibility: hidden;
}

.calendar-cell.clickable:active {
  opacity: 0.7;
}

.calendar-cell.expanded .cell-inner {
  border: 3rpx solid var(--primary-color);
}

.cell-inner {
  width: 100%;
  height: 100%;
  border-radius: 10rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

/* 热力色阶 - 深色版本 */
.cell-lv0 { background: #1A1A36; }
.cell-lv1 { background: rgba(7, 193, 96, 0.15); }
.cell-lv2 { background: rgba(7, 193, 96, 0.35); }
.cell-lv3 { background: rgba(255, 71, 87, 0.25); }
.cell-lv4 { background: #FF4757; }

.cell-lv4 .cell-day { color: #FFFFFF; }
.cell-lv4 .cell-expense { color: rgba(255,255,255,0.85); }

.cell-day-row {
  display: flex;
  align-items: center;
  gap: 4rpx;
}

.cell-day {
  font-size: 24rpx;
  font-weight: 600;
  color: var(--text-primary);
}

.income-dot {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background: var(--income-color);
  flex-shrink: 0;
}

.cell-expense {
  font-size: 16rpx;
  font-weight: 500;
  color: var(--expense-color);
  margin-top: 2rpx;
}

/* 展开的当日记录 */
.expanded-section {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  margin: 0 24rpx 20rpx;
  padding: 24rpx;
  box-shadow: var(--shadow-card);
}

.expanded-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.expanded-title {
  font-size: 28rpx;
  font-weight: 700;
  color: var(--text-primary);
}

.expanded-close {
  font-size: 24rpx;
  color: var(--text-hint);
  padding: 4rpx 12rpx;
}

.expanded-loading {
  text-align: center;
  padding: 32rpx 0;
  font-size: 24rpx;
  color: var(--text-hint);
}

.expanded-records {
  display: flex;
  flex-direction: column;
  gap: 2rpx;
}

.expanded-record-item {
  display: flex;
  align-items: center;
  padding: 16rpx 12rpx;
  border-bottom: 1rpx solid var(--border-color);
  gap: 12rpx;
}

.expanded-record-item:last-child {
  border-bottom: none;
}

.expando-icon {
  font-size: 24rpx;
  width: 36rpx;
  text-align: center;
  flex-shrink: 0;
}

.expando-cat {
  font-size: 26rpx;
  color: var(--text-primary);
  font-weight: 500;
}

.expando-note {
  font-size: 22rpx;
  color: var(--text-hint);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.expando-amount {
  font-size: 28rpx;
  font-weight: 700;
  flex-shrink: 0;
}

.ex-color { color: var(--expense-color); }
.in-color { color: var(--income-color); }

.expanded-empty {
  text-align: center;
  padding: 32rpx 0;
  font-size: 24rpx;
  color: var(--text-hint);
}

/* 加载 & 空状态 */
.loading {
  text-align: center;
  padding: 120rpx 0;
  color: var(--text-hint);
  font-size: 28rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0;
}

.empty-chart-icon {
  font-size: 100rpx;
  margin-bottom: 24rpx;
  opacity: 0.6;
}

.empty-title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 12rpx;
}

.empty-desc {
  font-size: 26rpx;
  color: var(--text-hint);
  margin-bottom: 8rpx;
}

.empty-hint {
  font-size: 24rpx;
  color: var(--text-hint);
}
```

- [ ] **Step 2: 提交**

```bash
git add pages/stats/index.wxss && git commit -m "style: 更新统计页样式为深色主题"
```

---

### Task 7: 更新统计页 ECharts 颜色和日历色阶

**Files:**
- Modify: `pages/stats/index.js`

- [ ] **Step 1: 更新 ECharts 图表文字和网格线颜色**

在 `pages/stats/index.js` 中，找到以下颜色值并替换：

1. 图例 `textStyle.color` → `'#9898C0'`
2. xAxis `axisLabel.color` → `'#6868A0'`
3. xAxis `axisLine.lineStyle.color` → `'rgba(255,255,255,0.06)'`
4. yAxis `axisLabel.color` → `'#6868A0'`
5. yAxis `splitLine.lineStyle.color` → `'rgba(255,255,255,0.04)'`
6. 饼图中间文字 `fill` → `'#E0E0F0'`
7. 饼图 label `color` → `'#9898C0'`
8. 饼图 `borderColor` → `'#1A1A36'`

具体的替换（在所有 3 个 chart 函数中做同样修改）：

```
find: textStyle: { fontSize: 12, color: '#666' }
replace: textStyle: { fontSize: 12, color: '#9898C0' }

find: axisLabel: { fontSize: 10, color: '#999' }
replace: axisLabel: { fontSize: 10, color: '#6868A0' }

find: axisLine: { lineStyle: { color: '#eee' } }
replace: axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } }

find: splitLine: { lineStyle: { color: '#f5f5f5', type: 'dashed' } }
replace: splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)', type: 'dashed' } }

find: fill: '#333', fontSize: 14
replace: fill: '#E0E0F0', fontSize: 14

find: label: { formatter: '{b}\n{d}%', fontSize: 10, color: '#666'
replace: label: { formatter: '{b}\n{d}%', fontSize: 10, color: '#9898C0'

find: borderColor: '#fff', borderWidth: 2
replace: borderColor: '#1A1A36', borderWidth: 2
```

- [ ] **Step 2: 提交**

```bash
git add pages/stats/index.js && git commit -m "style: 更新统计页图表颜色适配深色主题"
```

---

### Task 8: 更新个人页样式

**Files:**
- Modify: `pages/profile/index.wxss:1-58`

- [ ] **Step 1: 替换所有硬编码颜色**

```css
.page {
  min-height: 100vh;
  background: var(--bg-color);
}

.user-card {
  display: flex;
  align-items: center;
  padding: 40rpx 32rpx;
  background: var(--card-bg);
  margin-bottom: 24rpx;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  margin-right: 24rpx;
  background: var(--card-hover);
}

.user-name {
  font-size: 34rpx;
  font-weight: 600;
  color: var(--text-primary);
}

.menu-section {
  background: var(--card-bg);
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 1rpx solid var(--border-color);
}

.menu-item:last-child {
  border-bottom: none;
}

.category {
  width: 30rpx;
  height: 30rpx;
}

.menu-label {
  font-size: 30rpx;
  color: var(--text-primary);
}

.menu-arrow {
  font-size: 36rpx;
  color: var(--text-hint);
}
```

- [ ] **Step 2: 提交**

```bash
git add pages/profile/index.wxss && git commit -m "style: 更新个人页样式为深色主题"
```

---

### Task 9: 更新登录页样式

**Files:**
- Modify: `pages/login/index.wxss:1-52`

- [ ] **Step 1: 替换所有硬编码颜色**

```css
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg-color);
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 120rpx;
}

.logo {
  font-size: 120rpx;
  margin-bottom: 24rpx;
}

.app-name {
  font-size: 44rpx;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16rpx;
}

.app-desc {
  font-size: 28rpx;
  color: var(--text-hint);
}

.login-section {
  width: 100%;
  padding: 0 64rpx;
}

.login-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background: var(--primary-color);
  color: #fff;
  font-size: 32rpx;
  border-radius: 44rpx;
  border: none;
}

.login-btn::after {
  border: none;
}
```

- [ ] **Step 2: 提交**

```bash
git add pages/login/index.wxss && git commit -m "style: 更新登录页样式为深色主题"
```

---

### Task 10: 更新类别管理页样式

**Files:**
- Modify: `pages/categories/index.wxss:1-204`

- [ ] **Step 1: 替换所有硬编码颜色**

```css
.page {
  min-height: 100vh;
  background: var(--bg-color);
}

.type-switcher {
  display: flex;
  background: var(--card-bg);
  padding: 16rpx 32rpx;
  gap: 16rpx;
}

.type-btn {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  font-size: 28rpx;
  color: var(--text-secondary);
  background: rgba(255,255,255,0.06);
  border-radius: var(--radius-sm);
}

.type-btn.active {
  background: var(--primary-color);
  color: #fff;
  font-weight: 600;
}

.list {
  background: var(--card-bg);
  margin: 20rpx 0;
}

.category-row {
  display: flex;
  align-items: center;
  padding: 20rpx 32rpx;
  border-bottom: 1rpx solid var(--border-color);
  background: var(--card-bg);
}

.category-row.dragging {
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.3);
  z-index: 10;
  position: relative;
}

.drag-handle {
  padding: 8rpx 16rpx 8rpx 0;
}

.drag-icon {
  font-size: 28rpx;
  color: var(--text-hint);
}

.cat-icon-wrap {
  width: 64rpx;
  height: 64rpx;
  border-radius: 14rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  overflow: hidden;
  background: var(--card-hover);
}

.cat-emoji {
  font-size: 32rpx;
}

.cat-img {
  width: 64rpx;
  height: 64rpx;
}

.cat-name {
  flex: 1;
  font-size: 30rpx;
  color: var(--text-primary);
}

.del-btn {
  font-size: 24rpx;
  color: var(--expense-color);
  padding: 8rpx 0 8rpx 24rpx;
}

.add-row {
  text-align: center;
  padding: 32rpx;
  color: var(--primary-color);
  font-size: 30rpx;
  background: var(--card-bg);
}

/* 弹窗 */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: var(--overlay-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  width: 620rpx;
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 32rpx;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-title {
  text-align: center;
  font-size: 32rpx;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 32rpx;
}

.form-item {
  margin-bottom: 28rpx;
}

.form-label {
  font-size: 26rpx;
  color: var(--text-secondary);
  margin-bottom: 12rpx;
  display: block;
}

.form-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.upload-btn {
  font-size: 24rpx;
  color: var(--primary-color);
  padding: 4rpx 16rpx;
  border: 1rpx solid var(--primary-color);
  border-radius: 20rpx;
}

.form-input {
  border: 1rpx solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 16rpx;
  font-size: 28rpx;
  color: var(--text-primary);
  width: 100%;
  box-sizing: border-box;
  background: var(--card-bg);
}

.icon-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.icon-item {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  border-radius: 10rpx;
  border: 2rpx solid transparent;
  background: var(--card-hover);
}

.icon-item.selected {
  border-color: var(--primary-color);
  background: rgba(7, 193, 96, 0.15);
}

.upload-preview {
  font-size: 24rpx;
}

.modal-actions {
  display: flex;
  border-top: 1rpx solid var(--border-color);
  padding-top: 24rpx;
  margin-top: 8rpx;
}

.modal-btn {
  flex: 1;
  text-align: center;
  padding: 16rpx;
  font-size: 30rpx;
}

.modal-btn.cancel { color: var(--text-secondary); }
.modal-btn.confirm { color: var(--primary-color); font-weight: 600; }
```

- [ ] **Step 2: 提交**

```bash
git add pages/categories/index.wxss && git commit -m "style: 更新类别管理页样式为深色主题"
```

---

### Task 11: 更新筛选记录页样式

**Files:**
- Modify: `pages/records/index.wxss:1-63`

- [ ] **Step 1: 替换所有硬编码颜色**

```css
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-color);
}

.filter-bar {
  padding: 20rpx 32rpx;
  background: var(--card-bg);
  border-bottom: 1rpx solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.filter-label {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text-primary);
}

.filter-tag {
  font-size: 22rpx;
  color: var(--primary-color);
  background: rgba(7, 193, 96, 0.12);
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
}

.scroll-view {
  flex: 1;
}

.record-list {
  background: var(--card-bg);
  margin: 16rpx 0;
}

.load-more, .no-more {
  text-align: center;
  padding: 24rpx;
  font-size: 24rpx;
  color: var(--text-hint);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 160rpx 0;
}

.empty-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 28rpx;
  color: var(--text-hint);
}
```

- [ ] **Step 2: 提交**

```bash
git add pages/records/index.wxss && git commit -m "style: 更新筛选记录页样式为深色主题"
```

---

### Task 12: 更新 record-item 组件样式

**Files:**
- Modify: `components/record-item/record-item.wxss:1-83`

- [ ] **Step 1: 替换所有硬编码颜色**

```css
.record-item {
  display: flex;
  align-items: center;
  padding: 24rpx 32rpx;
  background: var(--card-bg);
  border-bottom: 1rpx solid var(--border-color);
}

.record-item:active {
  background: var(--card-hover);
}

.icon-wrap {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 24rpx;
  overflow: hidden;
}

.icon-emoji {
  font-size: 38rpx;
}

.icon-img {
  width: 80rpx;
  height: 80rpx;
}

.record-body {
  flex: 1;
  min-width: 0;
}

.row-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.cat-name {
  font-size: 30rpx;
  font-weight: 500;
  color: var(--text-primary);
}

.record-amount {
  font-size: 32rpx;
  font-weight: 700;
  flex-shrink: 0;
  margin-left: 16rpx;
}

.record-amount.expense { color: var(--expense-color); }
.record-amount.income  { color: var(--income-color); }

.row-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.record-note {
  font-size: 24rpx;
  color: var(--text-hint);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.record-time {
  font-size: 24rpx;
  color: rgba(255,255,255,0.25);
  flex-shrink: 0;
  margin-left: 16rpx;
}
```

- [ ] **Step 2: 提交**

```bash
git add components/record-item/record-item.wxss && git commit -m "style: 更新记录项组件样式为深色主题"
```

---

### Task 13: 更新 summary-card 组件样式

**Files:**
- Modify: `components/summary-card/summary-card.wxss:1-93`

- [ ] **Step 1: 调整文字颜色**

summary-card 本身已经是深色渐变背景，主要调整文字颜色：

```css
.summary-card {
  background: linear-gradient(135deg, #1A1A2E, #16213E);
  border-radius: 20rpx;
  padding: 36rpx 32rpx;
  color: #E0E0F0;
  margin: 20rpx 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3);
}

.stat-item.income .stat-icon {
  background: rgba(7, 193, 96, 0.25);
  color: #07C160;
}

.stat-item.expense .stat-icon {
  background: rgba(255, 71, 87, 0.25);
  color: #FF4757;
}

.stat-item.income .stat-amount {
  color: #07C160;
}

.stat-item.expense .stat-amount {
  color: #FF4757;
}
```

其他部分不变。

- [ ] **Step 2: 提交**

```bash
git add components/summary-card/summary-card.wxss && git commit -m "style: 更新汇总卡片组件颜色适配深色主题"
```

---

### Task 14: 更新 category-grid 组件样式

**Files:**
- Modify: `components/category-grid/category-grid.wxss:1-35`

- [ ] **Step 1: 替换颜色**

```css
.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
  padding: 20rpx 0;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12rpx 0;
  border-radius: var(--radius-base);
}

.category-item.selected {
  background: rgba(7, 193, 96, 0.1);
}

.category-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  border: 2rpx solid transparent;
  margin-bottom: 8rpx;
}

.category-name {
  font-size: 24rpx;
  color: var(--text-primary);
}
```

- [ ] **Step 2: 提交**

```bash
git add components/category-grid/category-grid.wxss && git commit -m "style: 更新分类网格组件样式为深色主题"
```

---

### 验证

手动验证检查清单：
- [ ] 在微信开发者工具中编译，预览所有页面
- [ ] 首页 — 汇总卡片、记录列表、FAB 按钮、删除弹窗均显示正常
- [ ] 记账页 — 金额输入、类型切换、分类选择、保存按钮正常
- [ ] 统计页 — 视图切换、柱状图、饼图、日历热力色阶可读
- [ ] 个人页 — 用户卡片、菜单列表正常
- [ ] 类别管理页 — 列表、弹窗、图标选择正常
- [ ] 登录页 — Logo、登录按钮正常
- [ ] 筛选记录页 — 筛选栏、记录列表正常

const util = require('../../utils/util');
const echarts = require('../../components/ec-canvas/echarts');

// 柱状图初始化函数
function initBarChart(canvas, width, height, dpr, dailyData) {
  const chart = echarts.init(canvas, null, { width, height, devicePixelRatio: dpr });
  canvas.setChart(chart);

  const dates = dailyData.map(d => d.date.slice(-5)); // MM-DD
  const incomeData = dailyData.map(d => d.income || 0);
  const expenseData = dailyData.map(d => d.expense || 0);

  chart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['收入', '支出'], bottom: 0 },
    grid: { top: 20, bottom: 30, left: 10, right: 10, containLabel: true },
    xAxis: { type: 'category', data: dates, axisLabel: { fontSize: 10 } },
    yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
    series: [
      { name: '收入', type: 'bar', data: incomeData, color: '#07C160', barMaxWidth: 12 },
      { name: '支出', type: 'bar', data: expenseData, color: '#EE0A24', barMaxWidth: 12 }
    ]
  });

  return chart;
}

// 饼图初始化函数
function initPieChart(canvas, width, height, dpr, categories) {
  const chart = echarts.init(canvas, null, { width, height, devicePixelRatio: dpr });
  canvas.setChart(chart);

  const pieData = categories.map(c => ({
    name: c.name,
    value: c.amount
  }));

  chart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: ¥{c} ({d}%)' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '55%'],
      data: pieData,
      label: { formatter: '{b}\n{d}%', fontSize: 10 },
      emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.3)' } }
    }]
  });

  return chart;
}

// 年度柱状图初始化函数
function initYearBarChart(canvas, width, height, dpr, monthlyData) {
  const chart = echarts.init(canvas, null, { width, height, devicePixelRatio: dpr });
  canvas.setChart(chart);
  const months = monthlyData.map(d => d.month.slice(-2) + '月');
  chart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['收入', '支出'], bottom: 0 },
    grid: { top: 20, bottom: 30, left: 10, right: 10, containLabel: true },
    xAxis: { type: 'category', data: months, axisLabel: { fontSize: 10 } },
    yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
    series: [
      { name: '收入', type: 'bar', data: monthlyData.map(d => d.income || 0), color: '#07C160', barMaxWidth: 16 },
      { name: '支出', type: 'bar', data: monthlyData.map(d => d.expense || 0), color: '#EE0A24', barMaxWidth: 16 }
    ]
  });
  return chart;
}

Page({
  data: {
    mode: 'month',
    currentMonth: '',
    currentYear: 0,
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    totalIncomeStr: '0.00',
    totalExpenseStr: '0.00',
    balanceStr: '0.00',
    monthLabel: '',
    yearLabel: '',
    loading: false,
    chartsReady: false,
    barEc: {},
    pieEc: {},
  },

  onLoad() {
    const now = new Date();
    const currentMonth = util.getCurrentMonth();
    this.setData({
      currentMonth,
      currentYear: now.getFullYear(),
      monthLabel: util.formatMonthLabel(currentMonth),
      yearLabel: `${now.getFullYear()}年`
    });
  },

  onShow() {
    if (this.data.mode === 'month') {
      this.loadMonthData();
    } else {
      this.loadYearData();
    }
  },

  switchMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({ mode, chartsReady: false });
    if (mode === 'month') {
      this.loadMonthData();
    } else {
      this.loadYearData();
    }
  },

  changeMonth(e) {
    const dir = e.currentTarget.dataset.direction;
    const offset = dir === 'prev' ? -1 : 1;
    const newMonth = util.getMonthOffset(this.data.currentMonth, offset);
    this.setData({ currentMonth: newMonth, monthLabel: util.formatMonthLabel(newMonth), chartsReady: false });
    this.loadMonthData();
  },

  changeYear(e) {
    const dir = e.currentTarget.dataset.direction;
    const offset = dir === 'prev' ? -1 : 1;
    const newYear = this.data.currentYear + offset;
    this.setData({ currentYear: newYear, yearLabel: `${newYear}年`, chartsReady: false });
    this.loadYearData();
  },

  loadMonthData() {
    this.setData({ loading: true });
    wx.cloud.callFunction({
      name: 'getMonthlyStats',
      data: { yearMonth: this.data.currentMonth },
      success: (res) => {
        if (res.result.success) {
          const d = res.result.data;
          const daily = d.daily || [];
          const categories = d.categories || [];
          const hasData = d.totalIncome > 0 || d.totalExpense > 0;
          this.setData({
            totalIncome: d.totalIncome,
            totalExpense: d.totalExpense,
            balance: d.balance,
            totalIncomeStr: d.totalIncome.toFixed(2),
            totalExpenseStr: d.totalExpense.toFixed(2),
            balanceStr: d.balance.toFixed(2),
            loading: false,
            chartsReady: hasData
          }, () => {
            if (!hasData) return;
            wx.nextTick(() => {
              this._renderBar((canvas, w, h, dpr) => initBarChart(canvas, w, h, dpr, daily));
              this._renderPie((canvas, w, h, dpr) => initPieChart(canvas, w, h, dpr, categories));
            });
          });
        } else {
          this.setData({ loading: false });
        }
      },
      fail: () => {
        this.setData({ loading: false });
        wx.showToast({ title: '加载统计数据失败', icon: 'none' });
      }
    });
  },

  loadYearData() {
    this.setData({ loading: true });
    wx.cloud.callFunction({
      name: 'getYearlyStats',
      data: { year: this.data.currentYear },
      success: (res) => {
        if (res.result.success) {
          const d = res.result.data;
          const monthly = d.monthly || [];
          const categories = d.categories || [];
          const hasData2 = d.totalIncome > 0 || d.totalExpense > 0;
          this.setData({
            totalIncome: d.totalIncome,
            totalExpense: d.totalExpense,
            balance: d.balance,
            totalIncomeStr: d.totalIncome.toFixed(2),
            totalExpenseStr: d.totalExpense.toFixed(2),
            balanceStr: d.balance.toFixed(2),
            loading: false,
            chartsReady: hasData2
          }, () => {
            if (!hasData2) return;
            wx.nextTick(() => {
              this._renderBar((canvas, w, h, dpr) => initYearBarChart(canvas, w, h, dpr, monthly));
              this._renderPie((canvas, w, h, dpr) => initPieChart(canvas, w, h, dpr, categories));
            });
          });
        } else {
          this.setData({ loading: false });
        }
      },
      fail: () => {
        this.setData({ loading: false });
        wx.showToast({ title: '加载统计数据失败', icon: 'none' });
      }
    });
  },

  _renderBar(callback) {
    const c = this.selectComponent('#barChart');
    if (c) c.init(callback);
  },

  _renderPie(callback) {
    const c = this.selectComponent('#pieChart');
    if (c) c.init(callback);
  }
});
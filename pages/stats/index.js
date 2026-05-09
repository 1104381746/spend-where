const util = require('../../utils/util');
const echarts = require('../../components/ec-canvas/echarts');
const { CATEGORY_COLORS } = require('../../utils/constants');

var PageContext = null;

function initBarChart(canvas, width, height, dpr, dailyData, onBarClick) {
  const chart = echarts.init(canvas, null, { width, height, devicePixelRatio: dpr });
  canvas.setChart(chart);

  const dates = dailyData.map(d => d.date.slice(-5));
  const fullDates = dailyData.map(d => d.date);
  const incomeData = dailyData.map(d => d.income || 0);
  const expenseData = dailyData.map(d => d.expense || 0);

  chart.setOption({
    animationDuration: 800,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: function (params) {
        return params.map(p => {
          const color = p.seriesName === '收入' ? '#07C160' : '#EE0A24';
          return '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' + color + ';margin-right:6px;"></span>' + p.seriesName + ': ¥' + Number(p.value).toFixed(2);
        }).join('<br/>');
      }
    },
    legend: {
      data: ['收入', '支出'],
      bottom: 0,
      textStyle: { fontSize: 12, color: '#666' },
      itemWidth: 12,
      itemHeight: 8,
      itemGap: 24
    },
    grid: { top: 16, bottom: 40, left: 50, right: 16, containLabel: false },
    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: { fontSize: 10, color: '#999' },
      axisLine: { lineStyle: { color: '#eee' } },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLabel: { fontSize: 10, color: '#999' },
      splitLine: { lineStyle: { color: '#f5f5f5', type: 'dashed' } },
      axisLine: { show: false },
      axisTick: { show: false }
    },
    series: [
      {
        name: '收入', type: 'bar', data: incomeData,
        barMaxWidth: 16, barGap: '30%',
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#3EDB7A' }, { offset: 1, color: '#07C160' }
          ])
        },
        label: {
          show: true, position: 'top', fontSize: 9, color: '#07C160',
          formatter: function (p) { return p.value > 0 ? p.value : ''; }
        }
      },
      {
        name: '支出', type: 'bar', data: expenseData,
        barMaxWidth: 16,
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#FF6B6B' }, { offset: 1, color: '#EE0A24' }
          ])
        },
        label: {
          show: true, position: 'top', fontSize: 9, color: '#EE0A24',
          formatter: function (p) { return p.value > 0 ? p.value : ''; }
        }
      }
    ]
  });

  chart.off('click');
  chart.on('click', function (params) {
    if (params.dataIndex !== undefined && onBarClick) {
      onBarClick(fullDates[params.dataIndex], params.seriesName);
    }
  });

  return chart;
}

function initPieChart(canvas, width, height, dpr, categories, totalExpense, onPieClick) {
  const chart = echarts.init(canvas, null, { width, height, devicePixelRatio: dpr });
  canvas.setChart(chart);

  const pieData = categories.map((c, i) => ({
    name: c.name, value: c.amount,
    itemStyle: { color: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }
  }));

  chart.setOption({
    color: CATEGORY_COLORS,
    animationDuration: 800,
    tooltip: {
      trigger: 'item',
      formatter: '{b}: ¥{c} ({d}%)',
      backgroundColor: 'rgba(0,0,0,0.75)',
      textStyle: { fontSize: 12 }
    },
    graphic: totalExpense > 0 ? {
      type: 'text', left: 'center', top: 'center',
      style: {
        text: '¥' + totalExpense.toFixed(0) + '\n总支出',
        textAlign: 'center', fill: '#333', fontSize: 14,
        fontWeight: 'bold', lineHeight: 20
      }
    } : null,
    series: [{
      type: 'pie',
      radius: ['48%', '72%'],
      center: ['50%', '52%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
      label: { formatter: '{b}\n{d}%', fontSize: 10, color: '#666', lineHeight: 14 },
      emphasis: {
        label: { fontSize: 14, fontWeight: 'bold' },
        itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.2)' }
      },
      data: pieData
    }]
  });

  chart.off('click');
  chart.on('click', function (params) {
    if (params.name && onPieClick) {
      onPieClick(params.name);
    }
  });

  return chart;
}

function initYearBarChart(canvas, width, height, dpr, monthlyData, onBarClick) {
  const chart = echarts.init(canvas, null, { width, height, devicePixelRatio: dpr });
  canvas.setChart(chart);

  const months = monthlyData.map(d => d.month.slice(-2) + '月');
  const fullMonths = monthlyData.map(d => d.month);
  const incomeData = monthlyData.map(d => d.income || 0);
  const expenseData = monthlyData.map(d => d.expense || 0);

  chart.setOption({
    animationDuration: 800,
    tooltip: {
      trigger: 'axis', axisPointer: { type: 'shadow' },
      formatter: function (params) {
        return params.map(p => {
          var color = p.seriesName === '收入' ? '#07C160' : '#EE0A24';
          return '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' + color + ';margin-right:6px;"></span>' + p.seriesName + ': ¥' + Number(p.value).toFixed(2);
        }).join('<br/>');
      }
    },
    legend: {
      data: ['收入', '支出'], bottom: 0,
      textStyle: { fontSize: 12, color: '#666' },
      itemWidth: 12, itemHeight: 8, itemGap: 24
    },
    grid: { top: 16, bottom: 40, left: 50, right: 16, containLabel: false },
    xAxis: {
      type: 'category', data: months,
      axisLabel: { fontSize: 10, color: '#999' },
      axisLine: { lineStyle: { color: '#eee' } },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLabel: { fontSize: 10, color: '#999' },
      splitLine: { lineStyle: { color: '#f5f5f5', type: 'dashed' } },
      axisLine: { show: false }, axisTick: { show: false }
    },
    series: [
      {
        name: '收入', type: 'bar', data: incomeData,
        barMaxWidth: 16, barGap: '30%',
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#3EDB7A' }, { offset: 1, color: '#07C160' }
          ])
        },
        label: {
          show: true, position: 'top', fontSize: 9, color: '#07C160',
          formatter: function (p) { return p.value > 0 ? p.value : ''; }
        }
      },
      {
        name: '支出', type: 'bar', data: expenseData,
        barMaxWidth: 16,
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#FF6B6B' }, { offset: 1, color: '#EE0A24' }
          ])
        },
        label: {
          show: true, position: 'top', fontSize: 9, color: '#EE0A24',
          formatter: function (p) { return p.value > 0 ? p.value : ''; }
        }
      }
    ]
  });

  chart.off('click');
  chart.on('click', function (params) {
    if (params.dataIndex !== undefined && onBarClick) {
      onBarClick(fullMonths[params.dataIndex], params.seriesName);
    }
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
    barEc: { lazyLoad: true },
    pieEc: { lazyLoad: true },
    calendarData: null,
    hasCalendarData: false,
    expandedDate: '',
    expandedDateRecords: [],
    expandedDateLoading: false,
    expandedDateLabel: ''
  },

  onLoad() {
    PageContext = this;
    var now = new Date();
    var currentMonth = util.getCurrentMonth();
    this.setData({
      currentMonth: currentMonth,
      currentYear: now.getFullYear(),
      monthLabel: util.formatMonthLabel(currentMonth),
      yearLabel: now.getFullYear() + '年'
    });
  },

  onShow() {
    if (this.data.mode === 'calendar') {
      this.loadCalendarData();
    } else if (this.data.mode === 'month') {
      this.loadMonthData();
    } else {
      this.loadYearData();
    }
  },

  switchMode(e) {
    var mode = e.currentTarget.dataset.mode;
    this.setData({
      mode: mode, chartsReady: false, calendarData: null,
      hasCalendarData: false, expandedDate: '', expandedDateRecords: []
    });
    if (mode === 'calendar') {
      this.loadCalendarData();
    } else if (mode === 'month') {
      this.loadMonthData();
    } else {
      this.loadYearData();
    }
  },

  changeMonth(e) {
    var dir = e.currentTarget.dataset.direction;
    var offset = dir === 'prev' ? -1 : 1;
    var newMonth = util.getMonthOffset(this.data.currentMonth, offset);
    this.setData({
      currentMonth: newMonth,
      monthLabel: util.formatMonthLabel(newMonth),
      chartsReady: false, calendarData: null,
      hasCalendarData: false, expandedDate: '', expandedDateRecords: []
    });
    if (this.data.mode === 'calendar') {
      this.loadCalendarData();
    } else {
      this.loadMonthData();
    }
  },

  changeYear(e) {
    var dir = e.currentTarget.dataset.direction;
    var offset = dir === 'prev' ? -1 : 1;
    var newYear = this.data.currentYear + offset;
    this.setData({
      currentYear: newYear,
      yearLabel: newYear + '年',
      chartsReady: false
    });
    this.loadYearData();
  },

  loadMonthData() {
    var self = this;
    this.setData({ loading: true });
    wx.cloud.callFunction({
      name: 'getMonthlyStats',
      data: { yearMonth: this.data.currentMonth },
      success: function (res) {
        if (res.result.success) {
          var d = res.result.data;
          var daily = d.daily || [];
          var categories = d.categories || [];
          var hasData = d.totalIncome > 0 || d.totalExpense > 0;
          self.setData({
            totalIncome: d.totalIncome,
            totalExpense: d.totalExpense,
            balance: d.balance,
            totalIncomeStr: d.totalIncome.toFixed(2),
            totalExpenseStr: d.totalExpense.toFixed(2),
            balanceStr: d.balance.toFixed(2),
            loading: false,
            chartsReady: hasData
          }, function () {
            if (!hasData) return;
            wx.nextTick(function () {
              self._renderBar(function (canvas, w, h, dpr) {
                return initBarChart(canvas, w, h, dpr, daily, function (date, seriesName) {
                  wx.navigateTo({ url: '/pages/records/index?date=' + date });
                });
              });
              self._renderPie(function (canvas, w, h, dpr) {
                return initPieChart(canvas, w, h, dpr, categories, d.totalExpense, function (category) {
                  wx.navigateTo({ url: '/pages/records/index?category=' + encodeURIComponent(category) + '&type=expense' });
                });
              });
            });
          });
        } else {
          self.setData({ loading: false });
        }
      },
      fail: function () {
        self.setData({ loading: false });
        wx.showToast({ title: '加载统计数据失败', icon: 'none' });
      }
    });
  },

  loadYearData() {
    var self = this;
    this.setData({ loading: true });
    wx.cloud.callFunction({
      name: 'getYearlyStats',
      data: { year: this.data.currentYear },
      success: function (res) {
        if (res.result.success) {
          var d = res.result.data;
          var monthly = d.monthly || [];
          var categories = d.categories || [];
          var hasData = d.totalIncome > 0 || d.totalExpense > 0;
          self.setData({
            totalIncome: d.totalIncome,
            totalExpense: d.totalExpense,
            balance: d.balance,
            totalIncomeStr: d.totalIncome.toFixed(2),
            totalExpenseStr: d.totalExpense.toFixed(2),
            balanceStr: d.balance.toFixed(2),
            loading: false,
            chartsReady: hasData
          }, function () {
            if (!hasData) return;
            wx.nextTick(function () {
              self._renderBar(function (canvas, w, h, dpr) {
                return initYearBarChart(canvas, w, h, dpr, monthly, function (month, seriesName) {
                  wx.navigateTo({ url: '/pages/records/index?date=' + month + '-01' });
                });
              });
              self._renderPie(function (canvas, w, h, dpr) {
                return initPieChart(canvas, w, h, dpr, categories, d.totalExpense, function (category) {
                  wx.navigateTo({ url: '/pages/records/index?category=' + encodeURIComponent(category) + '&type=expense' });
                });
              });
            });
          });
        } else {
          self.setData({ loading: false });
        }
      },
      fail: function () {
        self.setData({ loading: false });
        wx.showToast({ title: '加载统计数据失败', icon: 'none' });
      }
    });
  },

  loadCalendarData() {
    var self = this;
    this.setData({ loading: true, expandedDate: '', expandedDateRecords: [] });
    wx.cloud.callFunction({
      name: 'getMonthlyStats',
      data: { yearMonth: this.data.currentMonth },
      success: function (res) {
        if (res.result.success) {
          var d = res.result.data;
          var daily = d.daily || [];
          var dailyMap = {};
          daily.forEach(function (item) {
            dailyMap[item.date] = item;
          });
          var parts = self.data.currentMonth.split('-');
          var year = parseInt(parts[0]);
          var month = parseInt(parts[1]);
          var daysInMonth = new Date(year, month, 0).getDate();
          var firstDay = new Date(year, month - 1, 1).getDay();

          var maxExpense = 0;
          daily.forEach(function (item) {
            if (item.expense > maxExpense) maxExpense = item.expense;
          });

          var cells = [];
          for (var i = 0; i < firstDay; i++) {
            cells.push(null);
          }
          for (var d2 = 1; d2 <= daysInMonth; d2++) {
            var dateStr = self.data.currentMonth + '-' + (d2 < 10 ? '0' : '') + d2;
            var dayData = dailyMap[dateStr];
            var expense = dayData ? dayData.expense : 0;
            var income = dayData ? dayData.income : 0;
            var level = maxExpense > 0 ? Math.min(4, Math.floor((expense / maxExpense) * 5)) : 0;
            cells.push({
              day: d2,
              date: dateStr,
              expense: expense,
              income: income,
              expenseStr: expense > 0 ? expense.toFixed(0) : '',
              incomeStr: income > 0 ? income.toFixed(0) : '',
              level: level,
              hasData: expense > 0 || income > 0
            });
          }

          var rows = [];
          var rowCount = Math.ceil(cells.length / 7);
          for (var r = 0; r < rowCount; r++) {
            var rowCells = cells.slice(r * 7, (r + 1) * 7);
            while (rowCells.length < 7) {
              rowCells.push(null);
            }
            rows.push(rowCells);
          }

          self.setData({
            totalIncome: d.totalIncome,
            totalExpense: d.totalExpense,
            balance: d.balance,
            totalIncomeStr: d.totalIncome.toFixed(2),
            totalExpenseStr: d.totalExpense.toFixed(2),
            balanceStr: d.balance.toFixed(2),
            loading: false,
            calendarData: rows,
            hasCalendarData: daily.length > 0
          });
        } else {
          self.setData({ loading: false });
        }
      },
      fail: function () {
        self.setData({ loading: false });
        wx.showToast({ title: '加载统计数据失败', icon: 'none' });
      }
    });
  },

  onTapCalendarCell(e) {
    var cell = e.currentTarget.dataset.cell;
    if (!cell || !cell.hasData) return;

    if (this.data.expandedDate === cell.date) {
      this.setData({ expandedDate: '', expandedDateRecords: [], expandedDateLabel: '' });
      return;
    }

    var self = this;
    this.setData({ expandedDate: cell.date, expandedDateLoading: true, expandedDateLabel: util.formatDate(cell.date) });
    wx.cloud.callFunction({
      name: 'getRecords',
      data: { date: cell.date, pageSize: 50 },
      success: function (res) {
        if (res.result.success) {
          self.setData({ expandedDateRecords: res.result.data, expandedDateLoading: false });
        } else {
          self.setData({ expandedDateLoading: false });
        }
      },
      fail: function () {
        self.setData({ expandedDateLoading: false });
      }
    });
  },

  _renderBar(callback) {
    var c = this.selectComponent('#barChart');
    if (c) c.init(callback);
  },

  _renderPie(callback) {
    var c = this.selectComponent('#pieChart');
    if (c) c.init(callback);
  }
});

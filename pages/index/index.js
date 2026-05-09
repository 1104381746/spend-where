const util = require('../../utils/util');
const { PAGE_SIZE } = require('../../utils/constants');

Page({
  data: {
    records: [],
    groupedRecords: [],
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    currentMonth: '',
    monthLabel: '',
    page: 0,
    hasMore: true,
    loading: false,
    refreshing: false,
    showDeleteModal: false,
    deleteTarget: null,
    categoryMap: {}
  },

  onLoad() {
    const currentMonth = util.getCurrentMonth();
    this.setData({
      currentMonth,
      monthLabel: util.formatMonthLabel(currentMonth)
    });
    this.loadCategoryMap(() => {
      this.loadSummary();
      this.loadRecords(0, true);
    });
  },

  onShow() {
    this.loadCategoryMap(() => {
      this.loadSummary();
      this.loadRecords(0, true);
    });
  },

  loadCategoryMap(callback) {
    wx.cloud.callFunction({
      name: 'getCategories',
      success: (res) => {
        if (res.result.success) {
          const map = {};
          const all = [...(res.result.data.expense || []), ...(res.result.data.income || [])];
          all.forEach(c => { map[c.type + ':' + c.name] = c; });
          this.setData({ categoryMap: map });
        }
        callback && callback();
      },
      fail: () => { callback && callback(); }
    });
  },

  enrichRecord(r) {
    const cat = this.data.categoryMap[r.type + ':' + r.category];
    if (cat) {
      r.categoryIcon = cat.icon;
      r.categoryColor = cat.color;
      r.categoryImageUrl = cat.imageUrl || '';
    }
    return r;
  },

  loadSummary() {
    wx.cloud.callFunction({
      name: 'getMonthlyStats',
      data: { yearMonth: this.data.currentMonth },
      success: (res) => {
        if (res.result.success) {
          this.setData({
            totalIncome: res.result.data.totalIncome,
            totalExpense: res.result.data.totalExpense,
            balance: res.result.data.balance
          });
        }
      }
    });
  },

  loadRecords(page = 0, refresh = false) {
    if (this.data.loading) return;
    if (!refresh && !this.data.hasMore) return;
    this.setData({ loading: true });

    wx.cloud.callFunction({
      name: 'getRecords',
      data: { page, pageSize: PAGE_SIZE, yearMonth: this.data.currentMonth },
      success: (res) => {
        if (res.result.success) {
          const enriched = res.result.data.map(r => this.enrichRecord(r));
          const newRecords = refresh ? enriched : this.data.records.concat(enriched);
          this.setData({
            records: newRecords,
            page,
            hasMore: res.result.hasMore,
            groupedRecords: this.groupRecords(newRecords)
          });
        }
      },
      fail: () => { wx.showToast({ title: '加载失败', icon: 'none' }); },
      complete: () => { this.setData({ loading: false, refreshing: false }); }
    });
  },

  groupRecords(records) {
    const groups = [];
    let currentDate = '';
    let currentGroup = null;
    records.forEach(r => {
      const dateKey = r.date instanceof Date
        ? `${r.date.getFullYear()}-${String(r.date.getMonth() + 1).padStart(2, '0')}-${String(r.date.getDate()).padStart(2, '0')}`
        : r.date;
      if (dateKey !== currentDate) {
        currentGroup = { date: dateKey, dateLabel: util.formatDate(dateKey), items: [], dayIncome: 0, dayExpense: 0 };
        groups.push(currentGroup);
        currentDate = dateKey;
      }
      if (r.type === 'income') {
        currentGroup.dayIncome += r.amount;
      } else {
        currentGroup.dayExpense += r.amount;
      }
      currentGroup.items.push(r);
    });
    groups.forEach(g => {
      g.dayIncomeStr = g.dayIncome.toFixed(2);
      g.dayExpenseStr = g.dayExpense.toFixed(2);
    });
    return groups;
  },

  prevMonth() {
    const newMonth = util.getMonthOffset(this.data.currentMonth, -1);
    this.setData({
      currentMonth: newMonth,
      monthLabel: util.formatMonthLabel(newMonth)
    });
    this.loadSummary();
    this.loadRecords(0, true);
  },

  nextMonth() {
    const newMonth = util.getMonthOffset(this.data.currentMonth, 1);
    this.setData({
      currentMonth: newMonth,
      monthLabel: util.formatMonthLabel(newMonth)
    });
    this.loadSummary();
    this.loadRecords(0, true);
  },

  onRefresh() {
    this.setData({ refreshing: true });
    this.loadCategoryMap(() => {
      this.loadSummary();
      this.loadRecords(0, true);
    });
  },

  onLoadMore() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadRecords(this.data.page + 1);
    }
  },

  onTapRecord(e) {
    wx.navigateTo({ url: `/pages/add/index?id=${e.detail.record._id}` });
  },

  onDeleteRecord(e) {
    this.setData({ showDeleteModal: true, deleteTarget: e.detail.record });
  },

  confirmDelete() {
    const record = this.data.deleteTarget;
    if (!record) return;
    wx.cloud.callFunction({
      name: 'deleteRecord',
      data: { _id: record._id },
      success: (res) => {
        if (res.result.success) {
          wx.showToast({ title: '已删除', icon: 'success' });
          this.loadSummary();
          this.loadRecords(0, true);
        }
      },
      fail: () => { wx.showToast({ title: '删除失败', icon: 'none' }); },
      complete: () => { this.setData({ showDeleteModal: false, deleteTarget: null }); }
    });
  },

  cancelDelete() {
    this.setData({ showDeleteModal: false, deleteTarget: null });
  },

  goToAdd() { wx.switchTab({ url: '/pages/add/index' }); },
  goToStats() { wx.switchTab({ url: '/pages/stats/index' }); }
});

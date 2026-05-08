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
    page: 0,
    hasMore: true,
    loading: false,
    refreshing: false,
    showDeleteModal: false,
    deleteTarget: null
  },

  onLoad() {
    const currentMonth = util.getCurrentMonth();
    this.setData({ currentMonth });
    this.loadSummary();
    this.loadRecords(0, true);
  },

  onShow() {
    this.loadSummary();
    this.loadRecords(0, true);
  },

  // 加载月度汇总
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

  // 加载记录列表
  loadRecords(page = 0, refresh = false) {
    if (this.data.loading) return;
    if (!refresh && !this.data.hasMore) return;

    this.setData({ loading: true });

    wx.cloud.callFunction({
      name: 'getRecords',
      data: { page, pageSize: PAGE_SIZE, yearMonth: this.data.currentMonth },
      success: (res) => {
        if (res.result.success) {
          const newRecords = refresh ? res.result.data : this.data.records.concat(res.result.data);
          this.setData({
            records: newRecords,
            page: page,
            hasMore: res.result.hasMore,
            groupedRecords: this.groupRecords(newRecords)
          });
        }
      },
      fail: (err) => {
        wx.showToast({ title: '加载失败', icon: 'none' });
      },
      complete: () => {
        this.setData({ loading: false, refreshing: false });
      }
    });
  },

  // 按日期分组
  groupRecords(records) {
    const groups = [];
    let currentDate = '';
    let currentGroup = null;

    records.forEach(r => {
      const dateKey = r.date instanceof Date
        ? `${r.date.getFullYear()}-${String(r.date.getMonth() + 1).padStart(2, '0')}-${String(r.date.getDate()).padStart(2, '0')}`
        : r.date;

      if (dateKey !== currentDate) {
        currentGroup = {
          date: dateKey,
          dateLabel: util.formatDate(dateKey),
          items: []
        };
        groups.push(currentGroup);
        currentDate = dateKey;
      }
      currentGroup.items.push(r);
    });

    return groups;
  },

  // 下拉刷新
  onRefresh() {
    this.setData({ refreshing: true });
    this.loadSummary();
    this.loadRecords(0, true);
  },

  // 上拉加载更多
  onLoadMore() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadRecords(this.data.page + 1);
    }
  },

  // 点击记录 -> 编辑
  onTapRecord(e) {
    const record = e.detail.record;
    wx.navigateTo({
      url: `/pages/add/index?id=${record._id}`
    });
  },

  // 长按记录 -> 删除确认
  onDeleteRecord(e) {
    const record = e.detail.record;
    this.setData({
      showDeleteModal: true,
      deleteTarget: record
    });
  },

  // 确认删除
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
      fail: () => {
        wx.showToast({ title: '删除失败', icon: 'none' });
      },
      complete: () => {
        this.setData({ showDeleteModal: false, deleteTarget: null });
      }
    });
  },

  // 取消删除
  cancelDelete() {
    this.setData({ showDeleteModal: false, deleteTarget: null });
  },

  // 跳转到添加页
  goToAdd() {
    wx.switchTab({ url: '/pages/add/index' });
  },

  // 点击卡片跳转到统计
  goToStats() {
    wx.switchTab({ url: '/pages/stats/index' });
  }
});
const util = require('../../utils/util');
const { PAGE_SIZE } = require('../../utils/constants');

Page({
  data: {
    records: [],
    loading: false,
    hasMore: true,
    page: 0,
    filterDate: '',
    filterCategory: '',
    filterType: '',
    filterLabel: '',
    categoryMap: {}
  },

  onLoad(options) {
    const filterDate = options.date || '';
    const filterCategory = options.category || '';
    const filterType = options.type || '';
    let filterLabel = '';
    if (filterDate) {
      filterLabel = util.formatDate(filterDate);
    } else if (filterCategory) {
      filterLabel = filterCategory + (filterType === 'income' ? ' · 收入' : ' · 支出');
    }
    wx.setNavigationBarTitle({ title: filterLabel || '筛选记录' });
    this.setData({ filterDate, filterCategory, filterType, filterLabel });
    this.loadCategoryMap(() => {
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

  loadRecords(page = 0, refresh = false) {
    if (this.data.loading) return;
    if (!refresh && !this.data.hasMore) return;
    this.setData({ loading: true });

    const data = {
      page,
      pageSize: PAGE_SIZE,
      date: this.data.filterDate || undefined,
      category: this.data.filterCategory || undefined,
      type: this.data.filterType || undefined
    };

    wx.cloud.callFunction({
      name: 'getRecords',
      data,
      success: (res) => {
        if (res.result.success) {
          const enriched = res.result.data.map(r => this.enrichRecord(r));
          this.setData({
            records: refresh ? enriched : this.data.records.concat(enriched),
            page,
            hasMore: res.result.hasMore
          });
        }
      },
      fail: () => { wx.showToast({ title: '加载失败', icon: 'none' }); },
      complete: () => { this.setData({ loading: false }); }
    });
  },

  onLoadMore() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadRecords(this.data.page + 1);
    }
  },

  onTapRecord(e) {
    const id = e.detail.record._id;
    wx.navigateTo({ url: '/pages/add/index?id=' + id });
  }
});

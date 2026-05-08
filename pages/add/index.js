const { CATEGORY_MAP } = require('../../utils/constants');

Page({
  data: {
    editMode: false,
    recordId: null,

    // 表单数据
    amount: '',
    amountDisplay: '0.00',
    type: 'expense',
    category: '',
    categoryIcon: '',
    date: '',
    dateDisplay: '',
    note: '',

    // UI 状态
    categories: CATEGORY_MAP.expense,
    saving: false
  },

  onLoad(options) {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    this.setData({
      date: todayStr,
      dateDisplay: todayStr,
      categories: CATEGORY_MAP.expense
    });

    // 编辑模式：从首页传来记录 ID
    if (options.id) {
      this.setData({ editMode: true, recordId: options.id });
      this.loadRecord(options.id);
    }
  },

  // 加载现有记录（编辑模式）
  loadRecord(id) {
    wx.showLoading({ title: '加载中...' });
    const db = wx.cloud.database();
    db.collection('records').doc(id).get().then(res => {
      const record = res.data;
      const d = record.date instanceof Date ? record.date : new Date(record.date);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

      this.setData({
        amount: String(record.amount || ''),
        amountDisplay: (record.amount || 0).toFixed(2),
        type: record.type,
        category: record.category || '',
        categoryIcon: record.categoryIcon || '',
        date: dateStr,
        dateDisplay: dateStr,
        note: record.note || '',
        categories: CATEGORY_MAP[record.type] || CATEGORY_MAP.expense
      });
      wx.hideLoading();
    }).catch(() => {
      wx.hideLoading();
      wx.showToast({ title: '加载失败', icon: 'none' });
      wx.navigateBack();
    });
  },

  // 切换收支类型
  switchType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      type,
      category: '',
      categoryIcon: '',
      categories: CATEGORY_MAP[type]
    });
  },

  // 数字输入
  onAmountInput(e) {
    let value = e.detail.value;
    value = value.replace(/[^\d.]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    if (parts.length === 2 && parts[1].length > 2) {
      value = parts[0] + '.' + parts[1].substring(0, 2);
    }
    this.setData({
      amount: value,
      amountDisplay: value || '0.00'
    });
  },

  // 选择分类
  onSelectCategory(e) {
    this.setData({
      category: e.detail.name,
      categoryIcon: e.detail.icon
    });
  },

  // 日期选择
  onDateChange(e) {
    this.setData({
      date: e.detail.value,
      dateDisplay: e.detail.value
    });
  },

  // 备注输入
  onNoteInput(e) {
    this.setData({ note: e.detail.value });
  },

  // 保存
  onSave() {
    const { amount, type, category, date, note, editMode, recordId, saving } = this.data;
    if (saving) return;

    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      wx.showToast({ title: '请输入有效金额', icon: 'none' });
      return;
    }
    if (!category) {
      wx.showToast({ title: '请选择分类', icon: 'none' });
      return;
    }

    this.setData({ saving: true });

    const data = {
      amount: amountNum,
      type,
      category,
      categoryIcon: this.data.categoryIcon,
      note: note || '',
      date
    };

    if (editMode) {
      this.updateRecord(recordId, data);
    } else {
      this.addRecord(data);
    }
  },

  addRecord(data) {
    console.log('[addRecord] calling with data:', JSON.stringify(data));
    wx.cloud.callFunction({
      name: 'addRecord',
      data,
      success: (res) => {
        console.log('[addRecord] result:', JSON.stringify(res.result));
        if (res.result.success) {
          wx.showToast({ title: '保存成功', icon: 'success' });
          wx.navigateBack();
        } else {
          wx.showToast({ title: res.result.error || '保存失败', icon: 'none' });
        }
      },
      fail: (err) => {
        console.error('[addRecord] fail:', JSON.stringify(err));
        wx.showToast({ title: '保存失败', icon: 'none' });
      },
      complete: () => { this.setData({ saving: false }); }
    });
  },

  updateRecord(id, data) {
    wx.cloud.callFunction({
      name: 'updateRecord',
      data: { _id: id, ...data },
      success: (res) => {
        if (res.result.success) {
          wx.showToast({ title: '更新成功', icon: 'success' });
          wx.navigateBack();
        } else {
          wx.showToast({ title: res.result.error || '更新失败', icon: 'none' });
        }
      },
      fail: () => { wx.showToast({ title: '更新失败', icon: 'none' }); },
      complete: () => { this.setData({ saving: false }); }
    });
  }
});
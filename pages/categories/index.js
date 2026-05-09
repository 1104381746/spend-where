const { CATEGORY_ICONS } = require('../../utils/constants');

Page({
  data: {
    currentType: 'expense',
    categories: [],
    allCategories: { expense: [], income: [] },
    showAddModal: false,
    addName: '',
    addIcon: '',
    icons: CATEGORY_ICONS,
    // drag state
    dragging: false,
    dragIndex: -1,
    dragY: 0,
    dragStartY: 0,
    dragItemHeight: 0,
    dragOffsetY: 0
  },

  onLoad(options) {
    if (options.type) this.setData({ currentType: options.type });
  },

  onShow() {
    this.loadCategories();
  },

  loadCategories() {
    wx.cloud.callFunction({
      name: 'getCategories',
      success: (res) => {
        if (res.result.success) {
          const all = res.result.data;
          this.setData({
            allCategories: all,
            categories: all[this.data.currentType] || []
          });
        }
      }
    });
  },

  switchType(e) {
    const t = e.currentTarget.dataset.type;
    this.setData({ currentType: t, categories: this.data.allCategories[t] || [] });
  },

  // ---- drag sort ----
  onDragStart(e) {
    const idx = e.currentTarget.dataset.index;
    const touch = e.touches[0];
    // measure item height from first touch
    wx.createSelectorQuery().select('.category-row').boundingClientRect(rect => {
      if (!rect) return;
      this.setData({
        dragging: true,
        dragIndex: idx,
        dragStartY: touch.clientY,
        dragY: touch.clientY,
        dragItemHeight: rect.height,
        dragOffsetY: 0
      });
    }).exec();
  },

  onDragMove(e) {
    if (!this.data.dragging) return;
    const touch = e.touches[0];
    const offsetY = touch.clientY - this.data.dragStartY;
    const h = this.data.dragItemHeight;
    const cats = [...this.data.categories];
    const from = this.data.dragIndex;
    const steps = Math.round(offsetY / h);
    const to = Math.max(0, Math.min(cats.length - 1, from + steps));

    if (to !== from) {
      const item = cats.splice(from, 1)[0];
      cats.splice(to, 0, item);
      this.setData({ categories: cats, dragIndex: to, dragStartY: touch.clientY });
      this.setData({ dragOffsetY: 0 });
    } else {
      this.setData({ dragOffsetY: offsetY - steps * h });
    }
  },

  onDragEnd() {
    if (!this.data.dragging) return;
    this.setData({ dragging: false, dragIndex: -1, dragOffsetY: 0 });
    const orders = this.data.categories.map((c, i) => ({ _id: c._id, order: i }));
    wx.cloud.callFunction({ name: 'updateCategoryOrder', data: { orders } });
    // sync back to allCategories
    const all = { ...this.data.allCategories, [this.data.currentType]: this.data.categories };
    this.setData({ allCategories: all });
  },

  // ---- add ----
  showAdd() {
    this.setData({ showAddModal: true, addName: '', addIcon: '' });
  },

  hideAdd() {
    this.setData({ showAddModal: false });
  },

  onAddNameInput(e) {
    this.setData({ addName: e.detail.value });
  },

  selectIcon(e) {
    this.setData({ addIcon: e.currentTarget.dataset.icon });
  },

  uploadIcon() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const path = res.tempFilePaths[0];
        wx.cloud.uploadFile({
          cloudPath: `category-icons/${Date.now()}.jpg`,
          filePath: path,
          success: (r) => {
            this.setData({ addIcon: '__image__', uploadedFileId: r.fileID });
          },
          fail: () => wx.showToast({ title: '上传失败', icon: 'none' })
        });
      }
    });
  },

  confirmAdd() {
    const { addName, addIcon, currentType, uploadedFileId } = this.data;
    if (!addName.trim()) return wx.showToast({ title: '请输入名称', icon: 'none' });
    if (!addIcon) return wx.showToast({ title: '请选择图标', icon: 'none' });

    const isImage = addIcon === '__image__';
    wx.cloud.callFunction({
      name: 'addCategory',
      data: {
        name: addName.trim(),
        icon: isImage ? '🖼' : addIcon,
        type: currentType,
        imageUrl: isImage ? uploadedFileId : ''
      },
      success: (res) => {
        if (res.result.success) {
          wx.showToast({ title: '添加成功', icon: 'success' });
          this.setData({ showAddModal: false, uploadedFileId: '' });
          this.loadCategories();
        } else {
          wx.showToast({ title: res.result.error || '添加失败', icon: 'none' });
        }
      }
    });
  },

  // ---- delete ----
  deleteCategory(e) {
    const { id, name } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认删除',
      content: `删除"${name}"？`,
      success: (res) => {
        if (!res.confirm) return;
        wx.cloud.callFunction({
          name: 'deleteCategory',
          data: { _id: id },
          success: (r) => {
            if (r.result.success) {
              wx.showToast({ title: '已删除', icon: 'success' });
              this.loadCategories();
            } else {
              wx.showToast({ title: r.result.error || '删除失败', icon: 'none' });
            }
          }
        });
      }
    });
  }
});

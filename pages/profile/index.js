Page({
  data: { userInfo: null },

  onShow() {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      wx.reLaunch({ url: '/pages/login/index' });
      return;
    }
    this.setData({ userInfo });
  },

  goToCategories(e) {
    const type = e.currentTarget.dataset.type;
    wx.navigateTo({ url: `/pages/categories/index?type=${type}` });
  },

  onShareAppMessage() {
    return {
      title: '花哪了 - 每一笔，都清楚',
      path: '/pages/splash/index'
    };
  },

  onLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success(res) {
        if (res.confirm) {
          wx.removeStorageSync('userInfo');
          wx.reLaunch({ url: '/pages/login/index' });
        }
      }
    });
  }
});

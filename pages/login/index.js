Page({
  data: {
    avatarUrl: '',
    nickName: ''
  },

  onLoad() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      wx.reLaunch({ url: '/pages/index/index' });
    }
  },

  onChooseAvatar(e) {
    this.setData({ avatarUrl: e.detail.avatarUrl });
  },

  onNicknameInput(e) {
    this.setData({ nickName: e.detail.value });
  },

  onLogin() {
    const { nickName, avatarUrl } = this.data;
    if (!nickName || !avatarUrl) return;

    wx.cloud.callFunction({
      name: 'login',
      data: { nickName, avatarUrl },
      success: (cloudRes) => {
        if (cloudRes.result.success) {
          const userInfo = { nickName, avatarUrl };
          wx.setStorageSync('userInfo', userInfo);
          getApp().globalData.userInfo = userInfo;
          wx.reLaunch({ url: '/pages/index/index' });
        } else {
          wx.showToast({ title: '登录失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.showToast({ title: '登录失败', icon: 'none' });
      }
    });
  }
});

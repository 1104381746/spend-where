Page({
  onLoad() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      wx.reLaunch({ url: '/pages/index/index' });
    }
  },

  onLogin() {
    wx.getUserProfile({
      desc: '用于展示个人信息',
      success: (res) => {
        const { nickName, avatarUrl } = res.userInfo;
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
      },
      fail: () => {
        wx.showToast({ title: '需要授权才能使用', icon: 'none' });
      }
    });
  }
});

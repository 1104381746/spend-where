Page({
  onLoad() {
    setTimeout(() => {
      wx.reLaunch({ url: '/pages/login/index' });
    }, 3000);
  }
});

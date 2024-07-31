const app = getApp()

Page({
  data: {
    isLoggedIn: false,
    userInfo: null,
    totalAnswers: 0,
    totalTime: 0,
    totalCorrectRate: 0,
    todayAnswers: 0,
    todayTime: 0,
    todayCorrectRate: 0
  },

  onLoad: function() {
    this.checkLoginStatus();
  },

  onShow: function() {
    this.checkLoginStatus();
    if (this.data.isLoggedIn) {
      this.fetchUserStats();
    }
  },

  checkLoginStatus: function() {
    const isLoggedIn = app.globalData.isLoggedIn;
    this.setData({ 
      isLoggedIn: isLoggedIn,
      userInfo: isLoggedIn ? app.globalData.userInfo : null
    });

    if (isLoggedIn) {
      this.fetchUserStats();
    } else {
      // Reset stats when not logged in
      this.setData({
        totalAnswers: 0,
        totalTime: 0,
        totalCorrectRate: 0,
        todayAnswers: 0,
        todayTime: 0,
        todayCorrectRate: 0
      });
    }
  },

  fetchUserStats: function() {
    // In a real app, you would fetch this data from a server
    // For now, we'll use mock data
    this.setData({
      totalAnswers: 1843,
      totalTime: 720,
      totalCorrectRate: 85,
      todayAnswers: 23,
      todayTime: 45,
      todayCorrectRate: 91
    });

    // Update global data for statistics page
    app.globalData.myPageData = {
      totalAnswers: this.data.totalAnswers,
      totalTime: this.data.totalTime,
      todayAnswers: this.data.todayAnswers,
      todayTime: this.data.todayTime
    };
  },

  navigateToLogin: function() {
    wx.navigateTo({
      url: '/pages/wechat-login/wechat-login?redirect=my'
    });
  },

  onLogout: function() {
    app.logout();
    this.checkLoginStatus();
    wx.showToast({
      title: 'Logged out successfully',
      icon: 'success',
      duration: 2000
    });
  },

  navigateToWrongQuestions: function() {
    wx.showToast({
      title: 'Feature coming soon',
      icon: 'none'
    });
  },

  navigateToFavorites: function() {
    wx.showToast({
      title: 'Feature coming soon',
      icon: 'none'
    });
  },

  navigateToFeedback: function() {
    wx.showToast({
      title: 'Feature coming soon',
      icon: 'none'
    });
  }
});
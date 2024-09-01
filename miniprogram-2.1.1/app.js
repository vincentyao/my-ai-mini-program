App({
  globalData: {
    userInfo: null,
    isLoggedIn: false,
    collectedQuestions: [],
    collectedQuestionsUpdated: false,
    myPageData: null
  },

  onLaunch: function () {
    // Check if the user is logged in
    this.checkLoginStatus();

    // Get system info
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;  
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    });
  },

  checkLoginStatus: function() {
    const token = wx.getStorageSync('token');
    if (token) {
      this.globalData.isLoggedIn = true;
      // You might want to validate the token with your server here
    } else {
      this.globalData.isLoggedIn = false;
    }
  },

  login: function(userInfo) {
    // Here you would typically send the user info to your server and get a token
    // For this example, we'll just save the user info and set isLoggedIn to true
    this.globalData.userInfo = userInfo;
    this.globalData.isLoggedIn = true;
    wx.setStorageSync('token', 'dummy_token');
  },

  logout: function() {
    this.globalData.userInfo = null;
    this.globalData.isLoggedIn = false;
    wx.removeStorageSync('token');
  }
})
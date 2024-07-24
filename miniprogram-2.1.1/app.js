App({
  globalData: {
    isLoggedIn: false,
    userInfo: null,
    myPageData: null,
    studentInfo: null
  },
  
  onLaunch: function() {
    // Check if the user is already logged in
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.globalData.isLoggedIn = true;
      this.globalData.userInfo = userInfo;
    }

    // Load student info if available
    const studentInfo = wx.getStorageSync('studentInfo');
    if (studentInfo) {
      this.globalData.studentInfo = studentInfo;
    }
  },

  login: function(userInfo) {
    this.globalData.isLoggedIn = true;
    this.globalData.userInfo = userInfo;
    wx.setStorageSync('userInfo', userInfo);
  },

  logout: function() {
    this.globalData.isLoggedIn = false;
    this.globalData.userInfo = null;
    wx.removeStorageSync('userInfo');
  }
});
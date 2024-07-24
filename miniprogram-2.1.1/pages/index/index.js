const app = getApp()

Page({
  data: {
    currentDate: '',
    isLoggedIn: false
  },
  onLoad: function() {
    this.setCurrentDate()
  },
  onShow: function() {
    this.setData({
      isLoggedIn: app.globalData.isLoggedIn
    })
  },
  setCurrentDate: function() {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekday = weekdays[now.getDay()];
    const dateString = `${month}/${day} ${weekday}`;
    this.setData({
      currentDate: dateString
    });
  },
  onSignIn: function() {
    if (!this.data.isLoggedIn) {
      wx.navigateTo({
        url: '/pages/wechat-login/wechat-login'
      })
    } else {
      wx.showToast({
        title: ' get 10 points',
        icon: 'success',
        duration: 2000
      })
    }
  },
  onDailyQuestion: function() {
    if (!this.data.isLoggedIn) {
      wx.showModal({
        title: 'Login Required',
        content: 'You need to log in to view it',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/wechat-login/wechat-login?redirectTo=' + encodeURIComponent('/pages/daily-question/daily-question')
            })
          }
        }
      })
    } else {
      this.navigateToDailyQuestion()
    }
  },
  navigateToDailyQuestion: function() {
    wx.navigateTo({
      url: '/pages/daily-question/daily-question'
    })
  },
  onAskQuestion: function() {
    wx.showModal({
      title: 'Camera Permission',
      content: 'Need to obtain your mobile phone camera permission',
      cancelText: 'Cancel',
      confirmText: 'Confirm',
      success: (res) => {
        if (res.confirm) {
          wx.authorize({
            scope: 'scope.camera',
            success: () => {
              wx.showToast({
                title: 'camera opened',
                icon: 'success',
                duration: 2000
              })
              // Here you would typically add logic to actually use the camera
            },
            fail: () => {
              wx.showToast({
                title: 'Camera permission denied',
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      }
    })
  }
})
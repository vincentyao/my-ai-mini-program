const app = getApp()

Page({
  data: {
    currentDate: '',
    isLoggedIn: false,
    isCameraOpen: false
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
        title: 'get 10 points',
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
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.camera']) {
          this.openCamera();
        } else {
          wx.authorize({
            scope: 'scope.camera',
            success: () => {
              this.openCamera();
            },
            fail: () => {
              wx.showToast({
                title: 'Camera permission denied',
                icon: 'none',
                duration: 2000
              });
            }
          });
        }
      }
    });
  },

  openCamera: function() {
    this.setData({ isCameraOpen: true });
  },

  closeCamera: function() {
    this.setData({ isCameraOpen: false });
  },

  takePhoto: function() {
    const cameraContext = wx.createCameraContext();
    cameraContext.takePhoto({
      quality: 'high',
      success: (res) => {
        const tempImagePath = res.tempImagePath;
        console.log('Photo taken:', tempImagePath);
        wx.showToast({
          title: 'Photo taken successfully',
          icon: 'success',
          duration: 2000
        });
      },
      fail: (error) => {
        console.error('Failed to take photo:', error);
        wx.showToast({
          title: 'Failed to take photo',
          icon: 'none',
          duration: 2000
        });
      }
    });
  }
});
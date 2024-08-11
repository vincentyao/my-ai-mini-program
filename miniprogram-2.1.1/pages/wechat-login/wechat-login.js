const app = getApp()

Page({
  data: {
    redirect: '',
    codeNumber: '',
    encryptedDataNumber: '',
    ivNumber: '',
    sessionidNumber: '',
    tokennumber: '',
    openid_number: ''
  },
  onLoad: function(options) {
    if (options.redirect) {
      this.setData({
        redirect: options.redirect
      });
    }
  },
  getUserProfile: function(e) {
    wx.getUserProfile({
      desc: 'Used for user login',
      success: (res) => {
        console.log('User info:', res);
        this.setData({
          encryptedDataNumber: res.encryptedData,
          ivNumber: res.iv
        });
        this.login(res.userInfo);
      },
      fail: (err) => {
        console.error('Failed to get user profile:', err);
        wx.showToast({
          title: 'Failed to get user info',
          icon: 'none'
        });
      }
    });
  },
  login: function(userInfo) {
    wx.login({
      success: (loginRes) => {
        if (loginRes.code) {
          console.log('Login code:', loginRes.code);
          this.setData({
            codeNumber: loginRes.code
          });
          this.getSessionId(loginRes.code, userInfo);
        } else {
          console.log('Login failed:', loginRes.errMsg);
          wx.showToast({
            title: 'Login failed',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        console.error('wx.login failed:', err);
        wx.showToast({
          title: 'Login failed',
          icon: 'none'
        });
      }
    });
  },
  getSessionId: function(code, userInfo) {
    const encodedCode = encodeURIComponent(code);
    
    wx.request({
      url: `http://8.134.182.21:8089/user/sessionID/${encodedCode}`,
      method: 'GET',
      header: {
        'accept': 'application/json,application/*+json',
        'content-type': 'application/json;charset=UTF-8'
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.code === 200 && res.data.data && res.data.data.sessionID) {
          const sessionID = res.data.data.sessionID;
          console.log('Session ID:', sessionID);
          this.setData({
            sessionidNumber: sessionID
          });
          
          // Add a 2-second pause before calling authLogin
          wx.showLoading({
            title: 'Processing...',
          });
          setTimeout(() => {
            wx.hideLoading();
            this.authLogin(userInfo);
          }, 2000);
        } else {
          console.error('Failed to get session ID:', res);
          this.setData({
            sessionidNumber: ''
          });
          wx.showToast({
            title: 'Failed to obtain sessionid, login failed',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: (err) => {
        console.error('Request for session ID failed:', err);
        this.setData({
          sessionidNumber: ''
        });
        wx.showToast({
          title: 'Network error',
          icon: 'none'
        });
      }
    });
  },
  authLogin: function(userInfo) {
    wx.request({
      url: 'http://8.134.182.21:8089/user/authLogin',
      method: 'POST',
      header: {
        'Accept': 'application/json,application/*+json',
        'Content-Type': 'application/json;charset=UTF-8',
        'Accept-Encoding': 'gzip,compress,deflate',
        'Accept-Charset': 'utf-8'
      },
      data: {
        sessionID: this.data.sessionidNumber,
        iv: this.data.ivNumber,
        encryptedData: this.data.encryptedDataNumber
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.code === 200) {
          console.log('Auth login successful:', res.data);
          
          // Save token and openId
          if (res.data.data && res.data.data.openId && res.data.data.token) {
            this.setData({
              openid_number: res.data.data.openId,
              tokennumber: res.data.data.token
            });
            console.log('OpenID saved:', this.data.openid_number);
            console.log('Token saved:', this.data.tokennumber);
            
            // Save these to storage for persistence across app restarts
            wx.setStorageSync('openid_number', res.data.data.openId);
            wx.setStorageSync('tokennumber', res.data.data.token);
          } else {
            console.warn('Token or OpenID not found in the response');
            console.log('Current openid_number:', this.data.openid_number);
            console.log('Current tokennumber:', this.data.tokennumber);
          }
          
          // Check if the user has registered before
          if (res.data.data && res.data.data.hasRegister === true) {
            // If already registered, skip student-info page
            this.processLogin(userInfo, true);
          } else {
            // If not registered, proceed with normal flow
            this.processLogin(userInfo, false);
          }
        } else {
          console.error('Auth login failed:', res);
          wx.showToast({
            title: 'Login failed',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        console.error('Auth login request failed:', err);
        wx.showToast({
          title: 'Network error',
          icon: 'none'
        });
      }
    });
  },
  processLogin: function(userInfo, isRegistered) {
    app.login(userInfo);
    
    wx.showToast({
      title: 'Login successful',
      icon: 'success',
      duration: 2000
    });

    setTimeout(() => {
      if (isRegistered) {
        // If already registered, redirect to index or my page
        if (this.data.redirect === 'my') {
          wx.switchTab({
            url: '/pages/my/my'
          });
        } else {
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      } else {
        // If not registered, check for studentInfo
        const studentInfo = wx.getStorageSync('studentInfo');
        if (studentInfo) {
          app.globalData.studentInfo = studentInfo;
          if (this.data.redirect === 'my') {
            wx.switchTab({
              url: '/pages/my/my'
            });
          } else {
            wx.switchTab({
              url: '/pages/index/index'
            });
          }
        } else {
          wx.redirectTo({
            url: '/pages/student-info/student-info'
          });
        }
      }
    }, 2000);
  }
});
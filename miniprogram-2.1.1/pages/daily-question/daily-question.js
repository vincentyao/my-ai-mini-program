Page({
  data: {
    question: null,
    options: [],
    selectedOption: null
  },
  onLoad: function() {
    this.fetchDailyQuestion();
  },
  fetchDailyQuestion: function() {
    const openId = wx.getStorageSync('openid_number');
    const token = wx.getStorageSync('tokennumber');

    if (!openId || !token) {
      wx.showToast({
        title: 'Login information missing',
        icon: 'none',
        duration: 2000
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 2000);
      return;
    }

    wx.request({
      url: 'http://8.134.182.21:8089/question/dailyQuestion',
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      data: {
        openId: openId,
        uuid: "",
        questionType: 1,
        difficultLevel: 1
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data && res.data.data && res.data.data.content) {
          try {
            const questionData = JSON.parse(res.data.data.content);
            const options = questionData.content.split('\n');
            this.setData({ 
              question: questionData,
              options: options
            });
          } catch (error) {
            console.error('Failed to parse question data:', error);
            this.showErrorAndGoBack('Invalid question format');
          }
        } else {
          this.showErrorAndGoBack('Invalid question data');
        }
      },
      fail: (error) => {
        console.error('Request failed:', error);
        this.showErrorAndGoBack('Network error');
      }
    });
  },
  onOptionTap: function(e) {
    const selected = e.currentTarget.dataset.option;
    this.setData({ selectedOption: selected });
    
    if (selected === this.data.question.answer) {
      wx.showToast({
        title: 'Correct!',
        icon: 'success',
        duration: 2000
      });
    } else {
      wx.showToast({
        title: 'Incorrect. Try again!',
        icon: 'none',
        duration: 2000
      });
    }
  },
  showErrorAndGoBack: function(message) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    });
    setTimeout(() => {
      wx.navigateBack();
    }, 2000);
  },
  onCollect: function() {
    wx.showToast({
      title: 'Question collected',
      icon: 'success',
      duration: 2000
    });
  },
  onAskQuestion: function() {
    wx.navigateTo({
      url: '/pages/ask-question/ask-question'
    });
  },
  onCorrect: function() {
    wx.showModal({
      title: 'Submit Correction',
      content: 'Please describe the error or suggest a correction.',
      showCancel: true,
      confirmText: 'Submit',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: 'Correction submitted',
            icon: 'success',
            duration: 2000
          });
        }
      }
    });
  },
  onSubmit: function() {
    if (this.data.selectedOption) {
      wx.showToast({
        title: 'Answer submitted',
        icon: 'success',
        duration: 2000
      });
    } else {
      wx.showToast({
        title: 'Please select an answer',
        icon: 'none',
        duration: 2000
      });
    }
  }
})
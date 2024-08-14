Page({
  data: {
    grades: ['junior high school', 'primary school', 'high school'],
    gradeIndex: 0,
    regions: ['Hunan', 'others to be added later'],
    regionIndex: 0
  },
  bindGradeChange: function(e) {
    this.setData({
      gradeIndex: e.detail.value
    })
  },
  bindRegionChange: function(e) {
    this.setData({
      regionIndex: e.detail.value
    })
  },
  onSave: function() {
    const grade = this.data.grades[this.data.gradeIndex];
    const region = this.data.regions[this.data.regionIndex];
    console.log('Saved:', { grade, region });
    wx.showToast({
      title: 'Information saved',
      icon: 'success',
      duration: 2000
    });
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/daily-question/daily-question'
      });
    }, 2000);
  },
  onCancel: function() {
    wx.navigateBack();
  }
})
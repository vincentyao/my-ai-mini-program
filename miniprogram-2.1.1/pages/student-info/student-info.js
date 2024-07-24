const app = getApp();

Page({
  data: {
    educationLevels: ['Elementary', 'Middle School', 'High School'],
    grades: {
      'Elementary': ['First Grade', 'Second Grade', 'Third Grade', 'Fourth Grade', 'Fifth Grade', 'Sixth Grade'],
      'Middle School': ['Seventh Grade', 'Eighth Grade', 'Ninth Grade'],
      'High School': ['Tenth Grade', 'Eleventh Grade', 'Twelfth Grade']
    },
    regions: ['Hunan', 'Others'],
    textbookVersions: ['Unified Version', 'Others'],
    selectedEducationLevel: '',
    selectedGrade: '',
    selectedRegion: '',
    selectedTextbookVersion: '',
    studentName: '',
    showGrades: false
  },

  onEducationLevelChange(e) {
    const selectedEducationLevel = this.data.educationLevels[e.detail.value];
    this.setData({
      selectedEducationLevel: selectedEducationLevel,
      selectedGrade: '',
      showGrades: true
    });
  },

  onGradeChange(e) {
    const selectedGrade = this.data.grades[this.data.selectedEducationLevel][e.detail.value];
    this.setData({ selectedGrade: selectedGrade });
  },

  onRegionChange(e) {
    const selectedRegion = this.data.regions[e.detail.value];
    this.setData({ selectedRegion: selectedRegion });
  },

  onTextbookVersionChange(e) {
    const selectedTextbookVersion = this.data.textbookVersions[e.detail.value];
    this.setData({ selectedTextbookVersion: selectedTextbookVersion });
  },

  onStudentNameInput(e) {
    this.setData({ studentName: e.detail.value });
  },

  onSave() {
    const { selectedEducationLevel, selectedGrade, selectedRegion, selectedTextbookVersion, studentName } = this.data;
    
    if (!selectedEducationLevel || !selectedGrade || !selectedRegion || !selectedTextbookVersion || !studentName) {
      wx.showToast({
        title: 'Please check, complete all fields, and submit again.',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    const studentInfo = {
      educationLevel: selectedEducationLevel,
      grade: selectedGrade,
      region: selectedRegion,
      textbookVersion: selectedTextbookVersion,
      name: studentName
    };

    wx.setStorageSync('studentInfo', studentInfo);
    app.globalData.studentInfo = studentInfo;

    wx.showToast({
      title: 'Save Successful',
      icon: 'success',
      duration: 2000
    });

    setTimeout(() => {
      wx.switchTab({
        url: '/pages/index/index'
      });
    }, 2000);
  }
});
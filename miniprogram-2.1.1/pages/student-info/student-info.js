const app = getApp();

Page({
  data: {
    educationLevels: ['Elementary', 'Middle School', 'High School'],
    grades: {
      'Elementary': ['First Grade', 'Second Grade', 'Third Grade', 'Fourth Grade', 'Fifth Grade', 'Sixth Grade'],
      'Middle School': ['Seventh Grade', 'Eighth Grade', 'Ninth Grade'],
      'High School': ['Tenth Grade', 'Eleventh Grade', 'Twelfth Grade']
    },
    provinces: ['Hunan', 'Others'],
    textbookVersions: ['RJ', 'SJ', 'BSDJ', 'HJ', 'BBJ', 'XJ'],
    selectedEducationLevel: '',
    selectedGrade: '',
    selectedProvince: '',
    selectedTextbookVersion: '',
    nickname: '',
    realName: '',
    gender: '',
    age: '',
    city: '',
    role: '1',
    showGrades: false,
    openId: '',
    token: ''
  },

  onLoad: function() {
    const openId = wx.getStorageSync('openid_number');
    const token = wx.getStorageSync('tokennumber');
    console.log('Retrieved openId from storage:', openId);
    console.log('Retrieved token from storage:', token);
    if (openId && token) {
      this.setData({ openId: openId, token: token });
    } else {
      console.error('openId or token not found in storage');
      wx.showToast({
        title: 'Login information missing. Please login again.',
        icon: 'none',
        duration: 2000
      });
    }
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

  onProvinceChange(e) {
    const selectedProvince = this.data.provinces[e.detail.value];
    this.setData({ selectedProvince: selectedProvince });
  },

  onTextbookVersionChange(e) {
    const selectedTextbookVersion = this.data.textbookVersions[e.detail.value];
    this.setData({ selectedTextbookVersion: selectedTextbookVersion });
  },

  onNicknameInput(e) {
    this.setData({ nickname: e.detail.value });
  },

  onRealNameInput(e) {
    this.setData({ realName: e.detail.value });
  },

  onGenderInput(e) {
    this.setData({ gender: e.detail.value });
  },

  onAgeInput(e) {
    this.setData({ age: e.detail.value });
  },

  onCityInput(e) {
    this.setData({ city: e.detail.value });
  },

  getUserLevel() {
    if (this.data.selectedEducationLevel === 'Elementary') {
      const gradeMap = {
        'First Grade': 1,
        'Second Grade': 2,
        'Third Grade': 3,
        'Fourth Grade': 4,
        'Fifth Grade': 5,
        'Sixth Grade': 6
      };
      return gradeMap[this.data.selectedGrade] || 0;
    }
    return 0; // Default value if not Elementary or grade not found
  },

  onSave() {
    const { selectedEducationLevel, selectedGrade, selectedProvince, selectedTextbookVersion, nickname, realName, gender, age, city, role, openId, token } = this.data;
    
    if (!selectedEducationLevel || !selectedGrade || !selectedProvince || !selectedTextbookVersion || !nickname) {
      wx.showToast({
        title: 'Please complete all required fields.',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    if (!openId || !token) {
      console.error('openId or token is missing');
      wx.showToast({
        title: 'Login information missing. Please login again.',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    const userLevel = this.getUserLevel();

    // Create an array of key-value pairs in the specified order
    const studentInfoArray = [
      ['openID', openId],
      ['nickName', nickname],
      ['realName', realName || ""],
      ['gender', gender || ""],
      ['age', age || ""],
      ['city', city || ""],
      ['province', selectedProvince],
      ['userLevel', userLevel],
      ['text_book_version', selectedTextbookVersion],
      ['role', role]
    ];

    wx.showLoading({
      title: 'Saving...',
    });

    this.sendDataToBackend(studentInfoArray)
      .then((data) => {
        console.log('Registration successful:', data);
        const studentInfo = Object.fromEntries(studentInfoArray);
        wx.setStorageSync('studentInfo', studentInfo);
        app.globalData.studentInfo = studentInfo;

        wx.hideLoading();
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
      })
      .catch((error) => {
        console.error('Registration failed:', error);
        wx.hideLoading();
        wx.showToast({
          title: 'Save Failed: ' + error.message,
          icon: 'none',
          duration: 3000
        });
      });
  },

  sendDataToBackend(studentInfoArray) {
    return new Promise((resolve, reject) => {
      // Create a JSON string manually to preserve order
      const jsonString = '{' + studentInfoArray.map(([key, value]) => 
        `"${key}":${JSON.stringify(value)}`
      ).join(',') + '}';

      console.log('Sending data to backend:', jsonString);
      
      wx.request({
        url: 'http://8.134.182.21:8089/user/register',
        method: 'POST',
        data: jsonString,
        header: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + this.data.token
        },
        success: (res) => {
          console.log('Backend response:', res);
          if (res.statusCode === 200 && res.data.code === 200) {
            resolve(res.data);
          } else {
            reject(new Error('Registration failed: ' + (res.data.message || 'Unknown error')));
          }
        },
        fail: (err) => {
          console.error('Request failed:', err);
          reject(err);
        }
      });
    });
  }
});
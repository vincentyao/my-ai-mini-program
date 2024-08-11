Page({
  data: {
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    subjects: ['Chinese', 'Mathematics', 'English'],
    subjectIndex: 0,
    totalAnswers: 1843,
    totalTime: 720,
    todayAnswers: 23,
    todayTime: 45
  },

  onLoad: function (options) {
    const app = getApp();
    if (app.globalData.myPageData) {
      this.setData(app.globalData.myPageData);
    }
    this.initCharts();
  },

  onStartDateChange: function(e) {
    this.setData({ startDate: e.detail.value });
  },

  onEndDateChange: function(e) {
    this.setData({ endDate: e.detail.value });
  },

  onSubjectChange: function(e) {
    this.setData({ subjectIndex: e.detail.value });
  },

  onConfirm: function() {
    this.updateCharts();
    wx.showToast({
      title: 'Data update completed',
      icon: 'success',
      duration: 2000
    });
  },

  initCharts: function() {
    this.drawChart('answerChart', this.generateWeekData(this.data.totalAnswers), 'Total Answers');
    this.drawChart('timeChart', this.generateWeekData(this.data.totalTime / 24), 'Study Time (hours)');
  },

  drawChart: function(canvasId, data, label) {
    const query = wx.createSelectorQuery();
    query.select('#' + canvasId)
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        
        const width = res[0].width;
        const height = res[0].height;
        
        canvas.width = width * 2;
        canvas.height = height * 2;
        ctx.scale(2, 2);
        
        const padding = { top: 40, right: 20, bottom: 60, left: 40 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;
        
        const maxValue = Math.max(...data);
        const yScale = chartHeight / (maxValue * 1.1); // Add 10% headroom
        const barWidth = chartWidth / data.length * 0.6; // Reduced bar width
        const barSpacing = chartWidth / data.length * 0.4; // Increased spacing
        
        // Draw background
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, width, height);
        
        // Draw Y-axis
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding.left, padding.top);
        ctx.lineTo(padding.left, height - padding.bottom);
        ctx.stroke();
        
        // Draw Y-axis labels
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        for (let i = 0; i <= 5; i++) {
          const value = (maxValue / 5 * i).toFixed(0);
          const y = height - padding.bottom - (i / 5) * chartHeight;
          ctx.fillText(value, padding.left - 5, y);
        }
        
        // Draw bars and X-axis labels
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        ctx.fillStyle = '#4e79a7';
        days.forEach((day, i) => {
          const x = padding.left + (barWidth + barSpacing) * i;
          const barHeight = data[i] * yScale;
          const y = height - padding.bottom - barHeight;
          
          ctx.fillRect(x, y, barWidth, barHeight);
          
          // Draw data value on top of each bar
          ctx.fillStyle = '#333';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(data[i].toString(), x + barWidth / 2, y - 5);
          
          // Draw X-axis label
          ctx.fillStyle = '#333';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText(day, x + barWidth / 2, height - padding.bottom + 5);
          
          ctx.fillStyle = '#4e79a7';  // Reset fill color for next bar
        });
        
        // Draw chart title
        ctx.fillStyle = '#333';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(label, width / 2, 15);
      });
  },

  updateCharts: function() {
    this.drawChart('answerChart', this.generateWeekData(this.data.totalAnswers), 'Total Answers');
    this.drawChart('timeChart', this.generateWeekData(this.data.totalTime / 24), 'Study Time (hours)');
  },

  generateWeekData: function(total) {
    const avgPerDay = total / 7;
    const minValue = Math.max(0, avgPerDay * 0.5);  // Minimum 50% of average
    const maxValue = avgPerDay * 1.5;  // Maximum 150% of average

    return Array(7).fill(0).map(() => {
      const randomValue = minValue + Math.random() * (maxValue - minValue);
      return Math.round(randomValue);  // Round to nearest integer
    });
  }
});
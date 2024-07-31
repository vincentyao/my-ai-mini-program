Page({
  data: {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2
  },
  onLoad: function() {
    // You can load the question data here, e.g., from an API
  },
  onOptionTap: function(e) {
    const selected = e.currentTarget.dataset.index;
    if (selected === this.data.correctAnswer) {
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
  }
})
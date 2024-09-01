Page({
  data: {
    favoriteQuestions: []
  },

  onLoad: function() {
    this.loadFavoriteQuestions();
  },

  loadFavoriteQuestions: function() {
    const app = getApp();
    const questions = app.globalData.collectedQuestions || [];
    
    const formattedQuestions = questions.map((question, index) => {
      const truncatedQuestion = question.length > 10 ? question.substring(0, 10) + '...' : question;
      return `${index + 1}: ${truncatedQuestion}`;
    });

    this.setData({
      favoriteQuestions: formattedQuestions
    });
  }
});
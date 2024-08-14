Page({
  data: {
    question: null,
    options: [],
    selectedOption: null,
    userInput: '',
    messages: []
  },

  onLoad: function(options) {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    
    this.setData({
      question: prevPage.data.question,
      options: prevPage.data.options,
      selectedOption: prevPage.data.selectedOption
    });
  },

  onInputChange: function(e) {
    this.setData({
      userInput: e.detail.value
    });
  },

  onSubmitQuestion: function() {
    if (this.data.userInput.trim() === '') {
      return;
    }

    const userMessage = {
      type: 'user',
      content: this.data.userInput
    };

    const botMessage = {
      type: 'bot',
      content: 'Thank you for your question. Our team will get back to you shortly.'
    };

    this.setData({
      messages: [...this.data.messages, userMessage, botMessage],
      userInput: ''
    });

    // Here you would typically send the question to your backend
    console.log('Submitted question:', userMessage.content);

    // Scroll to the bottom of the chat
    this.scrollToBottom();
  },

  scrollToBottom: function() {
    wx.createSelectorQuery()
      .select('.chat-section')
      .boundingClientRect(function(rect){
        wx.pageScrollTo({
          scrollTop: rect.bottom
        })
      })
      .exec()
  }
});
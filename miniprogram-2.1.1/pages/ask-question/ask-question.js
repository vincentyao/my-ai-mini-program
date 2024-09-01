Page({
  data: {
    question: null,
    options: [],
    selectedOption: null,
    userInput: '',
    messages: [],
    isTyping: false,
    typingMessage: ''
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
    this.setData({
      messages: [...this.data.messages, userMessage],
      userInput: '',
      isTyping: true,
      typingMessage: ''
    });
    this.sendToBackend();
  },
  sendToBackend: function() {
    const url = 'http://8.134.182.21:8089/completions/stream';
    const allUserMessages = this.data.messages
      .filter(msg => msg.type === 'user')
      .map(msg => msg.content);
    
    const data = {
      sessionId: "string",
      messages: allUserMessages
    };
    
    wx.request({
      url: url,
      method: 'POST',
      data: data,
      header: {
        'Content-Type': 'application/json'
      },
      responseType: 'text',
      enableChunked: true,
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          this.processStreamingResponse(res.data);
        } else {
          console.error('Unexpected API response:', res);
          this.addBotMessage("抱歉，处理您的问题时出现错误。请稍后再试。");
        }
      },
      fail: (error) => {
        console.error('API request failed:', error);
        this.addBotMessage(`抱歉，发送请求时出现错误。错误信息: ${error.errMsg}`);
      },
      complete: () => {
        this.setData({ isTyping: false });
        if (this.data.typingMessage) {
          this.addBotMessage(this.data.typingMessage);
        }
        this.setData({ typingMessage: '' });
      }
    });
  },
  processStreamingResponse: function(responseText) {
    const lines = responseText.split('\n');
    let message = '';
    for (const line of lines) {
      if (line.startsWith('data:')) {
        const content = line.slice(5).trim();
        message += content;
        this.updateTypingMessage(message);
      }
    }
  },
  updateTypingMessage: function(message) {
    this.setData({ typingMessage: message });
  },
  addBotMessage: function(content) {
    const botMessage = {
      type: 'bot',
      content: content
    };
    this.setData({
      messages: [...this.data.messages, botMessage]
    });
  }
});
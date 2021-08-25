const Rappo = {}
window.addEventListener('DOMContentLoaded', (event) => {
  const chatbotWidget = document.getElementById('chatbotWidget')
  Rappo.widget = chatbotWidget
  chatbotWidget.className = 'chatbot chatbotClose'
});
window.Rappo = Rappo

window.addEventListener('message', function (e) {
  const data = e.data;
  if (data === 'open') {
    document.getElementById('chatbotWidget').className = 'chatbot chatbotOpen'
  } else if (data === 'close') {
    document.getElementById('chatbotWidget').className = 'chatbot chatbotClose'
  }
});
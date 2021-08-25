
/* module for importing other js files */
function include(file) {
  const script = document.createElement('script');
  script.src = file;
  script.type = 'text/javascript';
  script.defer = true;

  document.getElementsByTagName('head').item(0).appendChild(script);
}


// Bot pop-up intro
// document.addEventListener("DOMContentLoaded", () => {
//   const elemsTap = document.querySelector(".tap-target");
//   // eslint-disable-next-line no-undef
//   const instancesTap = M.TapTarget.init(elemsTap, {});
//   instancesTap.open();
//   setTimeout(() => {
//     instancesTap.close();
//   }, 4000);
// });

/* import components */
include('./static/js/components/index.js');

window.addEventListener('load', () => {
  // initialization
  $(document).ready(() => {
    // Bot pop-up intro
    $("div").removeClass("tap-target-origin");

    // drop down menu for close, restart conversation & clear the chats.
    $(".dropdown-trigger").dropdown();

    // initiate the modal for displaying the charts,
    // if you dont have charts, then you comment the below line
    $(".modal").modal();

    // enable this if u have configured the bot to start the conversation.
    // showBotTyping();
    // $("#userInput").prop('disabled', true);

    // if you want the bot to start the conversation
    // customActionTrigger();
  });
  // Toggle the chatbot screen
  $("#profile_div").click(() => {
    $(".profile_div").toggle();
    $(".widget").toggle();
    widgetToggleEvent(true)
  });

  // clear function to clear the chat contents of the widget.
  $("#clear").click(() => {
    $(".chats").fadeOut("normal", () => {
      $(".chats").html("");
      $(".chats").fadeIn();
    });
  });

  // close function to close the widget.
  $("#close").click(() => {
    $(".profile_div").toggle();
    $(".widget").toggle();
    scrollToBottomOfResults();
    widgetToggleEvent(false)
  });
});


// window.addEventListener('message', function (e) {
//   const data = e.data;
//   console.log('message', e)
//   alert(e.data)
// });

document.addEventListener('DOMContentLoaded', function () {

  window.addEventListener('message', function (e) {
    if (!$("#profile_div").is(':hidden')) {
      $(".profile_div").toggle();
      $(".widget").toggle();
      widgetToggleEvent(true)
    }
    if (e.data) {
      const data = JSON.parse(e.data);
      console.log('iframe message', data)
      sendChatCommandFromParent(data.payload, data.text )
    }
  });

  // document.getElementById('sendToWindow').addEventListener('click', function () {
  //   const message = JSON.stringify({
  //     message: 'Hello from iframe',
  //     date: Date.now(),
  //   });
  //   window.parent.postMessage(message, '*');
  // });
});

function sendChatCommandFromParent(payload, text) {
  if (!payload) {
    return
  }
  setTimeout(() => {
    setUserResponse(text);
    send(payload);
  }, 0)

  // delete the quickreplies
}

function widgetToggleEvent(toggle) {
  if (toggle) {
    window.parent.postMessage('open', '*')
  } else {
    window.parent.postMessage('close', '*')
  }
}

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
    showWidget();
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
    hideWidget();
    scrollToBottomOfResults();
  });
});


// window.addEventListener('message', function (e) {
//   const data = e.data;
//   console.log('message', e)
//   alert(e.data)
// });

document.addEventListener('DOMContentLoaded', function () {

  window.addEventListener('message', function (e) {
    const message = e.data;
    const messageType = message.type
    const messageData = message.data
    switch (messageType)
    {
      case '_open':
        {
          if (isWidgetHidden()) {
            showWidget();
          }
        }
        break;
      case '_close':
        {
          if (!isWidgetHidden()) {
            hideWidget();
          }
        }
        break;
      case '_send':
        {
          const data = messageData;
          if (isWidgetHidden() && data.text) {
            showWidget();
          }
          sendChatCommandFromParent(data.payload, data.text, data.metadata)
        }
        break;
    }
  });
  window.parent.postMessage({type: '_init', data: WURFL}, '*');
  hideWidget();
});

function sendChatCommandFromParent(payload, text, metadata, total_wait_ms = 0) {
  if (!payload) {
    return
  }
  try {
    if (text) {
      setUserResponse(text);
    }
    send(payload, text, metadata);
  } catch (error) {
    const MAX_WAIT_MS = 1000
    const WAIT_MS = 50
    if (total_wait_ms < MAX_WAIT_MS) {
      setTimeout(sendChatCommandFromParent, WAIT_MS, payload, text, metadata, total_wait_ms + WAIT_MS)
    }
  } 
}

function isWidgetHidden() {
  return !$("#profile_div").is(':hidden');
}

function showWidget() {
  sendChatCommandFromParent("/livechat_visible", "", {visible: true});
  $(".profile_div").hide();
  $(".widget").show();
  window.parent.postMessage({type: '_on_open'}, '*')
}

function hideWidget() {
  sendChatCommandFromParent("/livechat_visible", "", {visible: false});
  $(".profile_div").show();
  $(".widget").hide();
  window.parent.postMessage({type: '_on_close'}, '*')
}

const Rappo = {};
(function () {
  const RappoWidgetId = 'RappoChatbotWidget'
  const RappoIframeClass = '_rappo_chatbot'
  const RappoIframeOpenClass = '_rappo_chatbot_open'
  const RappoIframeCloseClass = '_rappo_chatbot_close'
  window.addEventListener('DOMContentLoaded', (event) => {
    const RappoChatbotWidget = document.getElementById(RappoWidgetId)
    Rappo.widget = RappoChatbotWidget
    RappoChatbotWidget.className = RappoIframeClass + ' _rappo_chatbot_close'
    Rappo.sendMessage = sendMessage
    Rappo.openWidget = openWidget
    Rappo.closeWidget = closeWidget
    window.Rappo = Rappo
  });
  function sendMessage(payload, text = "", metadata = {}) {
    Rappo.widget.contentWindow.postMessage({
      type: '_send',
      data: {
        payload: payload,
        text: text,
        metadata: metadata,
      }
    }, '*')
  }
  function openWidget() {
    Rappo.widget.contentWindow.postMessage({type: '_open'}, '*')
  }
  function closeWidget() {
    Rappo.widget.contentWindow.postMessage({type: '_close'}, '*')
  }
  window.addEventListener('message', function (e) {
    const message = e.data;
    const messageType = message.type
    const messageData = message.data
    let h = 590;
    switch (messageType)
    {
      case '_init':
        {
          let location_data = {}, browser_data = get_browser_data(), refferer_data = {}
          if (document.referrer) {
            refferer_data = {
              referrer: document.referrer,
            }
          }
          fetch('https://ipapi.co/json/')
          .then(function success(response) {
            return response.json()
          }).then(
            function resolve(responseJson) {
              location_data = responseJson;
            },
          ).finally(function done() {
              sendMessage("/start", "", {
                  location_data: location_data,
                  browser_data: browser_data,
                  referrer_data: refferer_data,
              });
          });
        }
        break;
      case '_on_open':
        {
          document.getElementById(RappoWidgetId).className = RappoIframeClass + ' ' + RappoIframeOpenClass
          if (window.innerHeight < h) {
            h = window.innerHeight - 30;
          }
          document.getElementById(RappoWidgetId).style.height = h + 'px'
        }
        break;
      case '_on_close':
        {
          document.getElementById(RappoWidgetId).className = RappoIframeClass + ' ' + RappoIframeCloseClass
          h = 72
          document.getElementById(RappoWidgetId).style.height = h + 'px'
        }
        break;
      case '_event':
        {
          const eventName = messageData.name
          if (eventName === 'livechat_start') {
            gtag('event', 'conversion', {'send_to': 'AW-964612562/UTN4COvmtPECENKj-8sD'});
          }
        }
        break;
    }
  });

  !function (t, e) { "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = t || self).uuidv4 = e() }(this, (function () { "use strict"; var t = "undefined" != typeof crypto && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || "undefined" != typeof msCrypto && "function" == typeof msCrypto.getRandomValues && msCrypto.getRandomValues.bind(msCrypto), e = new Uint8Array(16); function n() { if (!t) throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported"); return t(e) } for (var o = [], r = 0; r < 256; ++r)o.push((r + 256).toString(16).substr(1)); return function (t, e, r) { "string" == typeof t && (e = "binary" === t ? new Uint8Array(16) : null, t = null); var u = (t = t || {}).random || (t.rng || n)(); if (u[6] = 15 & u[6] | 64, u[8] = 63 & u[8] | 128, e) { for (var i = r || 0, d = 0; d < 16; ++d)e[i + d] = u[d]; return e } return function (t, e) { var n = e || 0, r = o; return (r[t[n + 0]] + r[t[n + 1]] + r[t[n + 2]] + r[t[n + 3]] + "-" + r[t[n + 4]] + r[t[n + 5]] + "-" + r[t[n + 6]] + r[t[n + 7]] + "-" + r[t[n + 8]] + r[t[n + 9]] + "-" + r[t[n + 10]] + r[t[n + 11]] + r[t[n + 12]] + r[t[n + 13]] + r[t[n + 14]] + r[t[n + 15]]).toLowerCase() }(u) } }));
  const RappoSenderId = localStorage.getItem('RappoSenderId') || uuidv4();
  localStorage.setItem('RappoSenderId', RappoSenderId)

  var gtagScript = document.createElement("script");
  gtagScript.type = "text/javascript";
  gtagScript.setAttribute("async", "true");
  gtagScript.setAttribute("src", "https://www.googletagmanager.com/gtag/js?id=AW-964612562");
  document.documentElement.firstChild.appendChild(gtagScript);
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-964612562');

  var wurlfScript = document.createElement("script");
  wurlfScript.type = "text/javascript";
  wurlfScript.setAttribute("crossorigin", "true");
  wurlfScript.setAttribute("src", "https://wurfl.io/wurfl.js");
  document.documentElement.firstChild.appendChild(wurlfScript);

  // https://stackoverflow.com/a/11219680/8471647
  function get_browser_data() {
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browserName  = navigator.appName;
    var fullVersion  = ''+parseFloat(navigator.appVersion); 
    var majorVersion = parseInt(navigator.appVersion,10);
    var nameOffset,verOffset,ix;

    // In Opera, the true version is after "Opera" or after "Version"
    if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
      browserName = "Opera";
      fullVersion = nAgt.substring(verOffset+6);
      if ((verOffset=nAgt.indexOf("Version"))!=-1) 
      fullVersion = nAgt.substring(verOffset+8);
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
      browserName = "Microsoft Internet Explorer";
      fullVersion = nAgt.substring(verOffset+5);
    }
    // In Chrome, the true version is after "Chrome" 
    else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
      browserName = "Chrome";
      fullVersion = nAgt.substring(verOffset+7);
    }
    // In Safari, the true version is after "Safari" or after "Version" 
    else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
      browserName = "Safari";
      fullVersion = nAgt.substring(verOffset+7);
      if ((verOffset=nAgt.indexOf("Version"))!=-1) 
        fullVersion = nAgt.substring(verOffset+8);
    }
    // In Firefox, the true version is after "Firefox" 
    else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
      browserName = "Firefox";
      fullVersion = nAgt.substring(verOffset+8);
    }
    // In most other browsers, "name/version" is at the end of userAgent 
    else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < 
            (verOffset=nAgt.lastIndexOf('/')) ) 
    {
      browserName = nAgt.substring(nameOffset,verOffset);
      fullVersion = nAgt.substring(verOffset+1);
      if (browserName.toLowerCase()==browserName.toUpperCase()) {
        browserName = navigator.appName;
      }
    }
    // trim the fullVersion string at semicolon/space if present
    if ((ix=fullVersion.indexOf(";"))!=-1)
      fullVersion=fullVersion.substring(0,ix);
    if ((ix=fullVersion.indexOf(" "))!=-1)
      fullVersion=fullVersion.substring(0,ix);

    majorVersion = parseInt(''+fullVersion,10);
    if (isNaN(majorVersion)) {
      fullVersion  = ''+parseFloat(navigator.appVersion); 
      majorVersion = parseInt(navigator.appVersion,10);
    }

    return {
        userAgent: navigator.userAgent,
        appName: navigator.appName,
        appVersion: navigator.appVersion,
        browserName: browserName,
        fullVersion: fullVersion,
        majorVersion: majorVersion,
        is_mobile: WURFL.is_mobile,
        complete_device_name: WURFL.complete_device_name,
        form_factor: WURFL.form_factor,
    }
  }
})()

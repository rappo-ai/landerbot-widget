const rasa_server_url = "https://client.rappo.renzil.com/webhooks/rest";
// const rasa_server_url = "http://localhost:5016/webhooks/rest";
const RappoSenderId = localStorage.getItem('RappoSenderId') || uuidv4();
localStorage.setItem('RappoSenderId', RappoSenderId)

/**
 * scroll to the bottom of the chats after new message has been added to chat
 */
const converter = new showdown.Converter();
function scrollToBottomOfResults() {
    const terminalResultsDiv = document.getElementById("chats");
    terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;
}

/**
 * Set user response on the chat screen
 * @param {String} message user message
 */
function setUserResponse(message) {
    const user_response = `<p class="userMsg">${message} </p><div class="clearfix"></div>`;
    $(user_response).appendTo(".chats").show("slow");

    $(".usrInput").val("");
    scrollToBottomOfResults();
    showBotTyping();
    $(".suggestions").remove();
}


/**
 * returns formatted bot response 
 * @param {String} text bot message response's text
 *
 */
function getBotResponse(text) {
    botResponse = `<p class="botMsg">${text}</p><div class="clearfix"></div>`;
    return botResponse;
}

function processTextBotReponse(text) {
    // convert the text to mardown format using showdown.js(https://github.com/showdownjs/showdown);
    let botResponse;
    let html = converter.makeHtml(text);
    html = html.replaceAll("<p>", "").replaceAll("</p>", "").replaceAll("<strong>", "<b>").replaceAll("</strong>", "</b>");
    html = html.replace(/(?:\r\n|\r|\n)/g, '<br>')
    console.log(html);
    // check for blockquotes
    if (html.includes("<blockquote>")) {
        html = html.replaceAll("<br>", "");
        botResponse = getBotResponse(html);
    }
    // check for image
    if (html.includes("<img")) {
        html = html.replaceAll("<img", '<img class="imgcard_mrkdwn" ');
        botResponse = getBotResponse(html);
    }
    // check for preformatted text
    if (html.includes("<pre") || html.includes("<code>")) {

        botResponse = getBotResponse(html);
    }
    // check for list text
    if (html.includes("<ul") || html.includes("<ol") || html.includes("<li") || html.includes('<h3')) {
        html = html.replaceAll("<br>", "");
        // botResponse = `<img class="botAvatar" src="./static/img/bot_avatar.png"/><span class="botMsg">${html}</span><div class="clearfix"></div>`;
        botResponse = getBotResponse(html);
    }
    else {
        // if no markdown formatting found, render the text as it is.
        if (!botResponse) {
            botResponse = `<p class="botMsg">${text}</p><div class="clearfix"></div>`;
        }
    }
    // append the bot response on to the chat screen
    $(botResponse).appendTo(".chats").hide().fadeIn(1000);
}

/**
 * renders bot response on to the chat screen
 * @param {Array} response json array containing different types of bot response
 *
 * for more info: `https://rasa.com/docs/rasa/connectors/your-own-website#request-and-response-format`
 */
function setBotResponse(response) {
    // renders bot response after 500 milliseconds
    setTimeout(() => {
        hideBotTyping();
        if (response.length < 1) {
            scrollToBottomOfResults();
        } else {
            // if we get response from Rasa
            for (let i = 0; i < response.length; i += 1) {
                // check if the response contains "text"
                if (Object.hasOwnProperty.call(response[i], "text")) {
                    if (response[i].text != null) {
                        processTextBotReponse(response[i].text)
                    }
                }

                // check if the response contains "images"
                if (Object.hasOwnProperty.call(response[i], "image")) {
                    if (response[i].image !== null) {
                        const BotResponse = `<div class="singleCard"><img class="imgcard" src="${response[i].image}"></div><div class="clearfix"></div>`;

                        $(BotResponse).appendTo(".chats").hide().fadeIn(1000);
                    }
                }

                // check if the response contains "buttons"
                if (Object.hasOwnProperty.call(response[i], "buttons")) {
                    if (response[i].buttons.length > 0) {
                        addSuggestion(response[i].buttons);
                    }
                }

                // check if the response contains "attachment"
                if (Object.hasOwnProperty.call(response[i], "attachment")) {
                    if (response[i].attachment != null) {
                        if (response[i].attachment.type === "video") {
                            // check if the attachment type is "video"
                            const video_url = response[i].attachment.payload.src;

                            const BotResponse = `<div class="video-container"> <iframe src="${video_url}" frameborder="0" allowfullscreen></iframe> </div>`;
                            $(BotResponse).appendTo(".chats").hide().fadeIn(1000);
                        }
                    }
                }
                // check if the response contains "custom" message
                if (Object.hasOwnProperty.call(response[i], "custom")) {
                    const { payload } = response[i].custom;

                    if (payload === "text") {
                        const text = response[i].custom.data;
                        const user = response[i].custom.event;
                        if (!user || user === "bot") {
                            const sender_type = response[i].custom.sender_type || "bot"
                            if (sender_type ===  "admin" && isWidgetHidden()) {
                                showWidget();
                            }
                            processTextBotReponse(text);
                        } else if (user === "user") {
                            setUserResponse(text)
                        }
                    }

                    if (payload === "quickReplies") {
                        // check if the custom payload type is "quickReplies"
                        const quickRepliesData = response[i].custom.data;
                        showQuickReplies(quickRepliesData);
                        return;
                    }

                    // check if the custom payload type is "pdf_attachment"
                    if (payload === "pdf_attachment") {
                        renderPdfAttachment(response[i]);
                        return;
                    }

                    // check if the custom payload type is "dropDown"
                    if (payload === "dropDown") {
                        const dropDownData = response[i].custom.data;
                        renderDropDwon(dropDownData);
                        return;
                    }

                    // check if the custom payload type is "location"
                    if (payload === "location") {
                        $("#userInput").prop("disabled", true);
                        getLocation();
                        scrollToBottomOfResults();
                        return;
                    }

                    // check if the custom payload type is "cardsCarousel"
                    if (payload === "cardsCarousel") {
                        const restaurantsData = response[i].custom.data;
                        showCardsCarousel(restaurantsData);
                        return;
                    }

                    // check if the custom payload type is "chart"
                    if (payload === "chart") {
                        /**
                         * sample format of the charts data:
                         *  var chartData =  { "title": "Leaves", "labels": ["Sick Leave", "Casual Leave", "Earned Leave", "Flexi Leave"], "backgroundColor": ["#36a2eb", "#ffcd56", "#ff6384", "#009688", "#c45850"], "chartsData": [5, 10, 22, 3], "chartType": "pie", "displayLegend": "true" }
                         */

                        const chartData = response[i].custom.data;
                        const {
                            title,
                            labels,
                            backgroundColor,
                            chartsData,
                            chartType,
                            displayLegend,
                        } = chartData;

                        // pass the above variable to createChart function
                        createChart(
                            title,
                            labels,
                            backgroundColor,
                            chartsData,
                            chartType,
                            displayLegend,
                        );

                        // on click of expand button, render the chart in the charts modal
                        $(document).on("click", "#expand", () => {
                            createChartinModal(
                                title,
                                labels,
                                backgroundColor,
                                chartsData,
                                chartType,
                                displayLegend,
                            );
                        });
                        return;
                    }

                    // check of the custom payload type is "collapsible"
                    if (payload === "collapsible") {
                        const { data } = response[i].custom;
                        // pass the data variable to createCollapsible function
                        createCollapsible(data);
                    }

                    if (payload === "event") {
                        const data = response[i].custom.data;
                        window.parent.postMessage({type: '_event', data: data}, '*')
                    }
                }
            }
            scrollToBottomOfResults();
        }
        scrollToBottomOfResults();
        $(".usrInput").focus();
    }, 500);

}

/**
 * sends the user message to the rasa server,
 * @param {String} payload message payload
 * @param {String} inputText user message
 * @param {String} metadata message metadata
 */
function send(payload, inputText, metadata) {
    if (!metadata) {
        metadata = {}
    }
    metadata["text"] = payload
    metadata["input_text"] = inputText
    metadata["sender_id"] = RappoSenderId
    $.ajax({
        url: rasa_server_url + "/webhook",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ text: payload, input_text: inputText, metadata: metadata, sender_id: RappoSenderId }),
        success(botResponse, status) {
            console.log("Response from Rasa: ", botResponse, "\nStatus: ", status);

            // if user wants to restart the chat and clear the existing chat contents
            if (payload.toLowerCase() === "/restart") {
                $("#userInput").prop("disabled", false);

                // if you want the bot to start the conversation after restart
                // customActionTrigger();
            }
            setBotResponse(botResponse);
        },
        error(xhr, textStatus) {
            if (payload.toLowerCase() === "/restart") {
                $("#userInput").prop("disabled", false);
                // if you want the bot to start the conversation after the restart action.
                // actionTrigger();
                // return;
            }

            // if there is no response from rasa server, set error bot response
            setBotResponse("");
            console.log("Error from bot end: ", textStatus);
        },
    });
}
/**
 * sends an event to the bot,
 *  so that bot can start the conversation by greeting the user
 *
 * `Note: this method will only work in Rasa 1.x`
 */
// eslint-disable-next-line no-unused-vars
function actionTrigger() {
    $.ajax({
        url: `http://localhost:5005/conversations/${RappoSenderId}/execute`,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            name: action_name,
            policy: "MappingPolicy",
            confidence: "0.98",
        }),
        success(botResponse, status) {
            console.log("Response from Rasa: ", botResponse, "\nStatus: ", status);

            if (Object.hasOwnProperty.call(botResponse, "messages")) {
                setBotResponse(botResponse.messages);
            }
            $("#userInput").prop("disabled", false);
        },
        error(xhr, textStatus) {
            // if there is no response from rasa server
            setBotResponse("");
            console.log("Error from bot end: ", textStatus);
            $("#userInput").prop("disabled", false);
        },
    });
}

/**
 * sends an event to the custom action server,
 *  so that bot can start the conversation by greeting the user
 *
 * Make sure you run action server using the command
 * `rasa run actions --cors "*"`
 *
 * `Note: this method will only work in Rasa 2.x`
 */
// eslint-disable-next-line no-unused-vars
function customActionTrigger() {
    $.ajax({
        url: "http://localhost:5055/webhook/",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            next_action: action_name,
            tracker: {
                sender_id: RappoSenderId,
            },
        }),
        success(botResponse, status) {
            console.log("Response from Rasa: ", botResponse, "\nStatus: ", status);

            if (Object.hasOwnProperty.call(botResponse, "responses")) {
                setBotResponse(botResponse.responses);
            }
            $("#userInput").prop("disabled", false);
        },
        error(xhr, textStatus) {
            // if there is no response from rasa server
            setBotResponse("");
            console.log("Error from bot end: ", textStatus);
            $("#userInput").prop("disabled", false);
        },
    });
}



/**
 * clears the conversation from the chat screen
 * & sends the `/resart` event to the Rasa server
 */
function restartConversation() {
    $("#userInput").prop("disabled", true);
    // destroy the existing chart
    $(".collapsible").remove();

    if (typeof chatChart !== "undefined") {
        chatChart.destroy();
    }

    $(".chart-container").remove();
    if (typeof modalChart !== "undefined") {
        modalChart.destroy();
    }
    $(".chats").html("");
    $(".usrInput").val("");
    send("/restart", "");
}
// triggers restartConversation function.
$("#restart").click(() => {
    restartConversation();
});

/**
 * if user hits enter or send button
 * */
$(".usrInput").on("keyup keypress", (e) => {
    const keyCode = e.keyCode || e.which;

    const text = $(".usrInput").val();
    if (keyCode === 13) {
        if (text === "" || $.trim(text) === "") {
            e.preventDefault();
            return false;
        }
        // destroy the existing chart, if yu are not using charts, then comment the below lines
        $(".collapsible").remove();
        $(".dropDownMsg").remove();
        if (typeof chatChart !== "undefined") {
            chatChart.destroy();
        }

        $(".chart-container").remove();
        if (typeof modalChart !== "undefined") {
            modalChart.destroy();
        }

        $("#paginated_cards").remove();
        $(".suggestions").remove();
        $(".quickReplies").remove();
        $(".usrInput").blur();
        setUserResponse(text);
        send(text, text);
        e.preventDefault();
        return false;
    }
    return true;
});

$("#sendButton").on("click", (e) => {
    const text = $(".usrInput").val();
    if (text === "" || $.trim(text) === "") {
        e.preventDefault();
        return false;
    }
    // destroy the existing chart
    if (typeof chatChart !== "undefined") {
        chatChart.destroy();
    }

    $(".chart-container").remove();
    if (typeof modalChart !== "undefined") {
        modalChart.destroy();
    }

    $(".suggestions").remove();
    $("#paginated_cards").remove();
    $(".quickReplies").remove();
    $(".usrInput").blur();
    $(".dropDownMsg").remove();
    setUserResponse(text);
    send(text, text);
    e.preventDefault();
    return false;
});

const evtSource = new EventSource(rasa_server_url + "/events?sender_id="+RappoSenderId, {withCredentials: false});
evtSource.onmessage = function(event) {
    setBotResponse(JSON.parse(event.data));
}

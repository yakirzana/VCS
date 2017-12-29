var socketChat = io('/chat');

var msgs = [];
var msgIndex = 0;

function initChat() {
    for(var chat of chats) {
        addMsg(chat._username == user, chat._username, chat._date, chat._msg, false,false);
    }
    $(".content").animate({ scrollTop: $('.content').prop("scrollHeight")}, 1);
}

function initSocket() {
    socketChat.on('addMsg',function (msg) {
        addMsg(msg._username == user, msg._username, msg._date, msg._msg,false,true);
    });
}

function initChatTimeUpdate() {
    setInterval(function(){
        for(var i = 0; i < msgIndex; i++) {
            var momentTime = moment(msgs[i], "DD/MM/YYYY H:mm:ss").fromNow();
            $( "#chat" + i ).html("<time>" + momentTime + "</time>");
        }
    }, 5000);
}

$( document ).ready(function() {
    initChat();
    initSocket();
    initChatTimeUpdate();
});




function getMsgHtml(isUser, username, time, msg) {
    var momentTime = moment(time, "DD/MM/YYYY H:mm:ss").fromNow();
    var msgToAdd = "<li class=\"";
    if(isUser)
        msgToAdd += "self";
    else
        msgToAdd += "other";
    msgToAdd += "\">";
    msgToAdd += "<div class=\"msg\">";
    msgToAdd += "<span class=\"username\">" + username + "</span>";
    msgToAdd += "<p>" + msg + "</p>";
    msgToAdd += "<span id='chat" + msgIndex + "'><time>" + momentTime + "</time></span>";
    msgToAdd += "</div>";
    msgToAdd += "</li>";
    msgs[msgIndex] = time;
    msgIndex++;

    return msgToAdd;
}

function addMsg(isUser, username, time, msg, fromClient, animate) {
    var msgToAdd = getMsgHtml(isUser, username, time, msg);
    if(animate) {
        $(msgToAdd).hide().appendTo(".content").show("slow");
        $(".content").animate({ scrollTop: $('.content').prop("scrollHeight")}, 1000);
    }
    else {
        $(msgToAdd).appendTo(".content");
    }

    if(fromClient)
        socketChat.emit('addMsg',{_username: username, _date: time, _msg: msg, _roomID: room._id});
}

function sendMsg() {
    var msg = $("#msg").val().trim();
    $("#msg").val("");
    if(msg == "") return;
    addMsg(true, user, moment().format('DD/MM/YYYY H:mm:ss'), msg, true, true);
}



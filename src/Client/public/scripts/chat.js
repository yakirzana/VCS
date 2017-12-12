function getMsgHtml(isUser, username, time, msg) {
    var msgToAdd = "<li class=\"";
    if(isUser)
        msgToAdd += "self";
    else
        msgToAdd += "other";
    msgToAdd += "\">";
    msgToAdd += "<div class=\"msg\">";
    msgToAdd += "<span class=\"username\">" + username + "</span>";
    msgToAdd += "<p>" + msg + "</p>";
    msgToAdd += "<time>" + time + "</time>";
    msgToAdd += "</div>";
    msgToAdd += "</li>";
    return msgToAdd;
}

function addMsg(isUser, username, time, msg) {
    var msgToAdd = getMsgHtml(isUser, username, time, msg);
    $(msgToAdd).hide().appendTo(".content").show("slow");
    $(".content").animate({ scrollTop: $('.content').prop("scrollHeight")}, 1000);
}

function sendMsg() {
    var msg = $("#msg").val().trim();
    $("#msg").val("");
    if(msg == "") return;
    addMsg(true, user, "21:03", msg);
}


function talk() {
    setTimeout(function(){
        addMsg(true, "יקיר", "20:58", "ימניאק");
        setTimeout(function(){
            addMsg(false, "אחיעד", "20:59", "נמאס לי");
            setTimeout(function(){
                addMsg(false, "אחיעד", "20:59", "כוסעמק");
                setTimeout(function(){
                    addMsg(false, "אחיעד", "20:59", "בא לי המבורגר");
                    setTimeout(function(){
                        addMsg(true, "יקיר", "21:00", "תאכל המבורגר ישמן");
                        setTimeout(function(){
                            addMsg(true, "יקיר", "21:00", "או שתאכל סלט עדיף");
                        }, 3000);
                    }, 3000);
                }, 3000);
            }, 3000);
        }, 3000);
    }, 3000);
}

$( document ).ready(function() {
    setTimeout(function(){
        talk();
        setTimeout(function(){
            talk();
            setTimeout(function(){
                talk();
            } , 18000);
        } , 18000);
    } , 5000);
});


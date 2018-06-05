var _user = user;
var _isLocked = true;
var _firstTime = true;
var refreshIntervalId = undefined;
var refreshIntervalIdPic = undefined;
var socket = io('/rooms');
var socketForPic = io('/pic');
var strings = strings;
var room = room;
var currentBase64 = null;
var isChanged = false;
var updateVisibleTimeout = null;
var timerId = null;

// parameters

const INTERVAL_UPDATE_BOARD = 500;
const INTERVAL_UPDATE_PIC = 2000;

//


function setSocketListeners() {
    socket.emit('init', _user);
    socket.on('init',function (userInControl) {
        if (userInControl != null)
            putUserInControl(userInControl);
    });

    socket.on('update',function(data) {
        var applet = document.ggbApplet;
        if (data !== undefined && data !== null && data != currentBase64) {
            fixVisiblityOnRefresh("hidden");
            applet.setBase64(data);
            currentBase64 = data;
            isChanged = false;
            if (updateVisibleTimeout != null)
                clearTimeout(updateVisibleTimeout);

            updateVisibleTimeout = setTimeout(function () {
                fixVisiblityOnRefresh("visible");
            }, 1000);


        }
    });

    socket.on('lockFromServer',function(user) {
        putUserInControl(user);
    });

    socket.on('releaseFromServer',function(user) {
        releaseUserControl(user);
    });

    socket.on('listOfUsers', function (list) {
        var listOfUsers = "<b>" + strings.activeUsers + ":</b><br/>";
        for (var i = 0; i < list.length; i++) {
            listOfUsers += list[i] + ",";
        }
        $("#listOfUsers").html(listOfUsers.slice(0, -1));
    })
}

var width = $(document).width();
if (width > 1000)
    width *= 0.8;
var height = $(document).height() - 125;

var parameters = {
    "id":"ggbApplet",
    "width": width,
    "height": height,
    "scaleContainerClass": 'applet_container',
    "showToolBar":true,
    "showMenuBar": true,
    "showAlgebraInput":true,
    "language": "en",
    "useBrowserForJS":true,
    "preventFocus":true,
    //"appName":"graphing"
};


var applet = new GGBApplet(parameters, true);


window.addEventListener("load", function() {
    applet.inject('applet_container');
});

function event() {
    if (!isChanged)
        return;
    var board = document.ggbApplet;
    var base64 = board.getBase64();
    if (base64 == currentBase64)
        return;
    socket.emit('update', base64);
    isChanged = false;
    console.log("send");
}

function eventPic() {
    var board = document.ggbApplet;
    var pic = board.getPNGBase64(1, false, undefined);
    var json = JSON.stringify({room: room._id, src: pic});
    socketForPic.emit('pic', json);
}


function ggbOnInit(){
    document.ggbApplet.registerUpdateListener(updateListener);
    document.ggbApplet.registerAddListener(addListener);
    document.ggbApplet.registerRemoveListener(removeListener);
    document.ggbApplet.registerStoreUndoListener(undoListener);
    document.ggbApplet.registerClearListener(clearListener);
    if(!_firstTime) return;
    _firstTime = false;
    initBoard();
}

function initBoard() {
    var applet = document.ggbApplet;
    //initial state of board if available
    if(room._base64 != null && room._base64 != undefined)
        applet.setBase64(room._base64);
    $('#loading-indicator').hide();
    $("#applet_container").removeClass("hidden");
    setSocketListeners();
}

function updateListener(objName) {
    var applet = document.ggbApplet;
    console.log("Update " + objName);
    isChanged = true;
}

function addListener(objName) {
    console.log("Add " + objName);
    isChanged = true;
}

function undoListener() {
    console.log("undo");
    isChanged = true;
}

function removeListener(objName) {
    console.log("Remove " + objName);
    isChanged = true;
}

function clearListener() {
    console.log("clear");
    isChanged = true;
    ggbOnInit();
}

function putUserInControl(userInControl) {
    if (!isTech && _user !== userInControl) {
        $('#btnControl').attr("disabled", true);
        $("#applet_container").addClass("disabled");
        $("#btnControl").html(strings.takeControl);
        _isLocked = true;
    }
    else if (_user === userInControl) {
        refreshIntervalId = setInterval(event, INTERVAL_UPDATE_BOARD);
        refreshIntervalIdPic = setInterval(eventPic, INTERVAL_UPDATE_PIC);
    }
    $('#userInControl').html(userInControl + " " + strings.inControl)

}

function fixVisiblityOnRefresh(value) {
    var cols = document.getElementsByClassName('algebraPanel');
    for(i=0; i<cols.length; i++) {
        cols[i].style.visibility = value;
    }
}

function releaseUserControl(user) {
    $('#btnControl').attr("disabled", false);
    $('#userInControl').html(strings.noOneInControl);
    if(_user === user) {
        clearInterval(refreshIntervalId);
        clearInterval(refreshIntervalIdPic);
    }
}

function lockBoard(lock) {
    if(!lock) { // _user release control
        socket.emit('releaseFromClient', _user);
        releaseUserControl(_user);
        $("#applet_container").addClass("disabled");
        _isLocked = true;
        $("#btnControl").html(strings.takeControl);
        clearTimeout(timerId);
    }
    else { // _user take control
        socket.emit('lockFromClient', _user);
        putUserInControl(_user);
        $("#applet_container").removeClass("disabled");
        _isLocked = false;
        $("#btnControl").html(strings.release);
        if (room._isTimeLimit == true)
            timerId = setTimeout(lockBoard, 1000 * room._timeLimit, false);
    }
}

function finishTask() {
    socket.emit('finish', _user);
}
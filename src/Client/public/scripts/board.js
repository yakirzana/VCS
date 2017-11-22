var _user;
var _isLocked = true;
var _firstTime = true;
var refreshIntervalId = undefined;
var socket = io('/rooms');
var strings = strings;
var room = room;


function setListenerToUpdate() {
    socket.emit('init', "");
    socket.on('init',function (userInControl) {
        if (userInControl != null)
            putUserInControl(userInControl);
    });

    socket.on('update',function(data) {
        var applet = document.ggbApplet;
        if(data !== undefined && data !== null) {
            applet.setBase64(data);
        }
    });

    socket.on('lockFromServer',function(user) {
        putUserInControl(user);
    });


    socket.on('releaseFromServer',function(user) {
        releaseUserControl(user);
    });       socket.emit('ready', "ok");
}


var parameters = {
    "id":"ggbApplet",
    "width":$(document).width() * 0.8,
    "height": $(document).height() * 0.78,
    "showToolBar":true,
    "borderColor":null,
    "showMenuBar":false,
    "allowStyleBar":true,
    "showAlgebraInput":true,
    "enableLabelDrags":false,
    "enableShiftDragZoom":true,
    "capturingThreshold":null,
    "showToolBarHelp":true,
    "language":"iw",
    "country":"IL",
    "errorDialogsActive":true,
    "showTutorialLink":false,
    "showLogging":false,
    "useBrowserForJS":true,
    "preventFocus":true,
    "perspective":"AG"
};


var applet = new GGBApplet(parameters, '5.0', 'applet_container');

window.onload = function() {
    applet.inject('applet_container');
}

function ggbOnInit(){
    if(!_firstTime) return;
    _firstTime = false;
    initBoard();
}

function initBoard() {
    var applet = document.ggbApplet;
    //initial state of board if available
    if(room._base64 != null && room._base64 != undefined)
        applet.setBase64(room._base64);
    $(".loading").addClass("hidden");
    $("#applet_container").removeClass("hidden");
    setListenerToUpdate();
}

function event() {
    console.log("send");
    var board = document.ggbApplet;
    var base64 = board.getBase64()
    socket.emit('update', base64);
}

function addListener(objName) {
//        var board = document.ggbApplet;
//        var changedValue = board.getValue(objName);
    console.log(objName);
//        var toExport = applet.getBase64();
//        socket.emit('update', toExport);
    //console.log("yakir");
}


function putUserInControl(userInControl) {
    if(_user !== userInControl) {
        $('#btnControl').attr("disabled", true);
        fixVisiblityOnRefresh("hidden");
    }
    else {
        refreshIntervalId = setInterval(event, 1000);
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
    fixVisiblityOnRefresh("visible");
    if(_user === user) {
        clearInterval(refreshIntervalId);
    }
}

function lockBoard(lock) {
    if(!lock) { // _user release control
        socket.emit('releaseFromClient', _user);
        releaseUserControl(_user);
        $("#applet_container").addClass("disabled");
        _isLocked = true;
        $("#btnControl").html(strings.takeControl);
    }
    else { // _user take control
        _user = $("#name").val();
        socket.emit('lockFromClient', _user);
        putUserInControl(_user);
        $("#applet_container").removeClass("disabled");
        _isLocked = false;
        $("#btnControl").html(strings.release);
    }
}
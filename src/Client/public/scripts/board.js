var _user = user;
var _isLocked = true;
var _firstTime = true;
var refreshIntervalId = undefined;
var socket = io('/rooms');
var strings = strings;
var room = room;


function setSocketListeners() {
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
    });
}


var parameters = {
    "id":"ggbApplet",
    "width": $(document).width() * 0.8,
    "height": $(document).height() - 125,
    "showToolBar":true,
    "showAlgebraInput":true,
    "language":"eb",
    "useBrowserForJS":true,
    "preventFocus":true,
    //"appName":"graphing"
};


var applet = new GGBApplet(parameters, true);


window.addEventListener("load", function() {
    applet.inject('applet_container');
});


function ggbOnInit(){
    document.ggbApplet.registerUpdateListener(updateListener);
    document.ggbApplet.registerAddListener(AddListener);
    document.ggbApplet.registerRemoveListener(RemoveListener);
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
    setSocketListeners();
}

function updateListener(objName) {
    console.log("Update " + objName);
}

function AddListener(objName) {
    console.log("Add " + objName);
}

function RemoveListener(objName) {
    console.log("Remove " + objName);
}

function event() {
    console.log("send");
    var board = document.ggbApplet;
    var base64 = board.getBase64();
    socket.emit('update', base64);
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
    return;
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
        socket.emit('lockFromClient', _user);
        putUserInControl(_user);
        $("#applet_container").removeClass("disabled");
        _isLocked = false;
        $("#btnControl").html(strings.release);
    }
}
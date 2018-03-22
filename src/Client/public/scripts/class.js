function addAlertToRoom(roomId, color) {
    cleanRoomBorder(roomId);
    $("#room" + roomId).addClass(color + "Border");
}

function removeAlertFromRoom(roomId, color) {
    $("#room" + roomId).removeClass(color + "Border");
}

function cleanRoomBorder(roomId) {
    removeAlertFromRoom(roomId, "red");
    removeAlertFromRoom(roomId, "green");
    removeAlertFromRoom(roomId, "orange");
    removeAlertFromRoom(roomId, "blue");

}

function addRoom() {

}
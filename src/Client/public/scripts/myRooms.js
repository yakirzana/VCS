function getRoomsHtml() {
    var html = "<div class=\"row\">\n";
    for (var i = 0; i < rooms.length; i++) {
        html += getRoomHtml(rooms[i]);
        if (i != rooms.length - 1 && i % 2 == 1) {
            html += "</div>\n" +
                "        <div class=\"row\">";
        }
    }

    html += "</div>\n";
    return html;
}

function getRoomHtml(room) {
    return "<div id=\"room" + room.id + "\" class=\"card\">\n" +
        "                <img class=\"card-img-top\"\n" +
        "                     src=\"https://previews.123rf.com/images/iimages/iimages1301/iimages130101248/17443634-Illustration-of-a-teacher-in-the-classroom-Stock-Vector-cartoon.jpg\"\n" +
        "                     alt=\"Card image cap\">\n" +
        "                <div class=\"card-block\">\n" +
        "                    <h4 class=\"card-title\">" + room.name + "</h4>\n" +
        "                    <p class=\"card-text\"> " + room.desc + "\n" +
        "                        </p>\n" +
        "                    <a href=\"/room/" + room.id + "\" class=\"btn btn-primary\">Enter Room</a>\n" +
        "                </div>\n" +
        "            </div>";
}

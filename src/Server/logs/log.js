var fs = require('fs');

module.exports = class Log {
    constructor(errorPath, infoPath) {
        this._errorPath = errorPath;
        this._infoPath = infoPath;
    }

    get errorPath() {
        return this._errorPath;
    }

    get infoPath() {
        return this._infoPath;
    }


    error(msg) {
        var msg = new Date() + " Error: " + msg + "\n";
        fs.appendFile(this.errorPath, msg , function (err) {
            if (err) throw err;
        });
    }

    info(msg) {
        var msg = new Date() + " Info: " + msg + "\n";
        fs.appendFile(this.infoPath, msg, function (err) {
            if (err) throw err;
        });
    }
};
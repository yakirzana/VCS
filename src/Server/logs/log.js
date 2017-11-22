var fs = require('fs');

module.exports = class Log {
    constructor(errorPath){
        this._errorPath = errorPath;
    }

    get errorPath() {
        return this._errorPath;
    }

    set errorPath(value) {
        this._errorPath = value;
    }

    error(msg) {
        var msg = new Date() + " Error: " + msg + "\n";
        fs.appendFile(this.errorPath, msg , function (err) {
            if (err) throw err;
        });
    }
}
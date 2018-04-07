var ClassSocket = require('./classSocket');

module.exports = function (io, sl) {
    this.alerts = new ClassSocket(io, sl);
    require('./roomSocket')(io, sl);
    require('./chatSocket')(io, sl, this.alerts);
};
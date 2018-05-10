var ClassSocket = require('./classSocket');

module.exports = function (io, sl, log) {
    this.alerts = new ClassSocket(io, sl, log);
    require('./roomSocket')(io, sl, this.alerts, log);
    require('./chatSocket')(io, sl, this.alerts, log);
};
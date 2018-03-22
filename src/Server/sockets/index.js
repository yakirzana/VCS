var ClassSocket = require('./classSocket');

module.exports = function (io, sl) {
    var alerts = new ClassSocket(io, sl);
    require('./roomSocket')(io, sl);
    require('./chatSocket')(io, sl, alerts);

};
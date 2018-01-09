module.exports = function (io, sl) {
    require('./roomSocket')(io, sl);
    require('./chatSocket')(io, sl);
}
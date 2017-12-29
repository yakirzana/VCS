module.exports = function(io, bl) {
    require('./roomSocket')(io, bl);
    require('./chatSocket')(io, bl);
}
module.exports = function(io, bl) {
    require('./roomSocket')(io, bl);
}
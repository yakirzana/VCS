module.exports = function(io, data) {
    require('./roomSocket')(io, data);
}
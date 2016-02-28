var config = require("../config");

module.exports = function() {
  return require("./" + config.DATA_FORMAT + "FetchNewData")();
};

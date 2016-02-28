var config = require("../config");

exports.get = function() {
  return require("./" + config.DATA_FORMAT + "InitialData").get();
};

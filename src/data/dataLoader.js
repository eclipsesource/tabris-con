var config = require("../../config");

exports.load = function() {
  return require("./" + config.DATA_FORMAT + "DataLoader").load();
};

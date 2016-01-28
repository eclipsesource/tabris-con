var config = require("../../config");

exports.load = function() {
  return require("./" + config.DATA_FORMAT.id + "DataLoader").load();
};

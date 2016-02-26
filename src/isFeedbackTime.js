var config = require("../config");

module.exports = function() {
  var currentTime = new Date();
  return new Date(config.FEEDBACK_START) <= currentTime && currentTime <= new Date(config.FEEDBACK_DEADLINE);
};

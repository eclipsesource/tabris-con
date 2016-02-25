var _ = require("lodash");
var config = require("../config");

module.exports = function(session) {
  return _.find(config.FREE_BLOCKS[config.DATA_FORMAT], function(block) {
    return new Date(session.startTimestamp) >= new Date(block[0]) &&
      new Date(session.endTimestamp) <= new Date(block[1]);
  }) || null;
};

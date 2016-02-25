var _ = require("lodash");
var config = require("../../config");
var dataFormat = config.DATA_FORMAT;

exports.insertIn = function(blocks) {
  // TODO: insert "free" blocks for googleIO data
  if (!config.FREE_BLOCKS || !config.FREE_BLOCKS[dataFormat] || dataFormat === "googleIO") {
    return blocks;
  }
  return _(config.FREE_BLOCKS[dataFormat])
    .map(function(freeBlock) {
      return {
        title: "BROWSE SESSIONS",
        sessionType: "free",
        startTimestamp: freeBlock[0],
        endTimestamp: freeBlock[1]
      };
    })
    .concat(blocks)
    .sortBy("sessionType")
    .reverse()
    .uniqWith(function(block1, block2) {
      return block1.startTimestamp === block2.startTimestamp && block1.sessionType !== block2.sessionType;
    })
    .sortBy("startTimestamp")
    .value();
};

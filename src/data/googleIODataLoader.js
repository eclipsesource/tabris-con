var keynote = require("../../resources/data/googleIO/keynote_v2.json");
var blocks = require("../../resources/data/googleIO/blocks_v4.json");
var sessionData = require("../../resources/data/googleIO/session_data_v1.70.json");

exports.load = function() {
  // TODO: stub
  return {
    keynote: keynote,
    blocks: blocks,
    sessionData: sessionData
  };
};

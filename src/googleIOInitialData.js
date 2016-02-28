exports.get = function() {
  return {
    keynote: require("../json/googleIO/keynote_v2.json"),
    blocks: require("../json/googleIO/blocks_v4.json"),
    sessionData: require("../json/googleIO/session_data_v1.70.json")
  };
};

exports.get = function() {
  return {
    keynote: require("../../resources/data/googleIO/keynote_v2.json"),
    blocks: require("../../resources/data/googleIO/blocks_v4.json"),
    sessionData: require("../../resources/data/googleIO/session_data_v1.70.json")
  };
};

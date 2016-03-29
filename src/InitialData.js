import _ from "lodash";

const DATA_SOURCE_DATA = Object.freeze({
  codService: {
    scheduledSessions: "../json/cod/scheduled_sessions.json"
  },
  googleIOService: {
    keynote: "../json/googleIO/keynote_v2.json",
    blocks: "../json/googleIO/blocks_v4.json",
    sessionData: "../json/googleIO/session_data_v1.70.json"
  }
});

export default class InitialData {
  static createFor(dataSource) {
    return _(DATA_SOURCE_DATA[dataSource])
      .transform((result, value, key) => result[key] = require(value), {})
      .value();
  }
}

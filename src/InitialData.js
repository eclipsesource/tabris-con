import _ from "lodash";

const FORMAT_RESOURCEDATA = {
  cod: {
    scheduledSessions: "../json/cod/scheduled_sessions.json"
  },
  googleIO: {
    keynote: "../json/googleIO/keynote_v2.json",
    blocks: "../json/googleIO/blocks_v4.json",
    sessionData: "../json/googleIO/session_data_v1.70.json"
  }
};

export default class InitialData {
  static createFor(dataFormat) {
    _(FORMAT_RESOURCEDATA[dataFormat])
      .transform((result, value, key) => result[key] = require(value), {});
  }
}

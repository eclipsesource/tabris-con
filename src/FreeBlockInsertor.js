import _ from "lodash";
import ConfigurationDate from "./ConfigurationDate";

export default class {
  constructor(config) {
    this._config = config;
  }

  insert(blocks) {
    // TODO: insert "free" blocks for googleIO data
    if (!this._config.FREE_BLOCKS || this._config.DATA_SOURCE === "googleIOService") {
      return blocks;
    }
    return _(this._config.FREE_BLOCKS)
      .map(freeBlock => ({
        title: "BROWSE SESSIONS",
        sessionType: "free",
        startTimestamp: new ConfigurationDate(this._config, freeBlock[0]).toJSON(),
        endTimestamp: new ConfigurationDate(this._config, freeBlock[1]).toJSON()
      }))
      .concat(blocks)
      .sortBy("sessionType")
      .reverse()
      .uniqWith(
        (block1, block2) =>
        block1.startTimestamp === block2.startTimestamp && block1.sessionType !== block2.sessionType
      )
      .sortBy("startTimestamp")
      .value();
  }
}

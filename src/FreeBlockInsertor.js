import _ from "lodash";
import ConfigurationDate from "./ConfigurationDate";
import texts from "./resources/texts";

export default class {
  constructor(config) {
    this._config = config;
  }

  insert(blocks) {
    // TODO: insert "free" blocks for googleIO data
    if (!this._config.FREE_BLOCKS || this._config.DATA_TYPE === "googleIO") {
      return blocks;
    }
    return _(this._config.FREE_BLOCKS)
      .map(freeBlock => ({
        title: texts.MY_SCHEDULE_PAGE_BROWSE_SESSIONS,
        blockType: "free",
        startTimestamp: new ConfigurationDate(this._config, freeBlock[0]).toJSON(),
        endTimestamp: new ConfigurationDate(this._config, freeBlock[1]).toJSON()
      }))
      .concat(blocks)
      .sortBy("blockType")
      .reverse()
      .uniqWith(
        (block1, block2) =>
        block1.startTimestamp === block2.startTimestamp && block1.blockType !== block2.blockType
      )
      .sortBy("startTimestamp")
      .value();
  }
}

import _ from "lodash";

export default class {
  constructor(dataFormat) {
    this._dataFormat = dataFormat;
  }

  insert(freeBlocks, blocks) {
    // TODO: insert "free" blocks for googleIO data
    if (!freeBlocks || this._dataFormat === "googleIO") {
      return blocks;
    }
    return _(freeBlocks[this._dataFormat])
      .map(freeBlock => ({
        title: "BROWSE SESSIONS",
        sessionType: "free",
        startTimestamp: freeBlock[0],
        endTimestamp: freeBlock[1]
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


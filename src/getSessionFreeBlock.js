import _ from "lodash";

export default function(session, config) {
  return _.find(config.FREE_BLOCKS[config.DATA_FORMAT],block =>
    new Date(session.startTimestamp) >= new Date(block[0]) && new Date(session.endTimestamp) <= new Date(block[1])
  ) || null;
}

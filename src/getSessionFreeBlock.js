import _ from "lodash";
import ConfigurationDate from "./ConfigurationDate";

export default function(session, config) {
  return _.find(config.FREE_BLOCKS, block =>
      new Date(session.startTimestamp) >= new ConfigurationDate(config, block[0]).toJSDate() &&
      new Date(session.endTimestamp) <= new ConfigurationDate(config, block[1]).toJSDate()
    ) || null;
}

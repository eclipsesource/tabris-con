import config from "./configs/config";
import ConfigurationDate from "./ConfigurationDate";

export default function() {
  let currentTime = new Date();
  return new ConfigurationDate(config, config.FEEDBACK_START).toJSDate() <= currentTime &&
    currentTime <= new ConfigurationDate(config, config.FEEDBACK_DEADLINE).toJSDate();
}

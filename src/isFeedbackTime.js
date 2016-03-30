import config from "./configs/config";

export default function() {
  let currentTime = new Date();
  return new Date(config.FEEDBACK_START) <= currentTime && currentTime <= new Date(config.FEEDBACK_DEADLINE);
}

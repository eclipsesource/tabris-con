var IMAGE_PATH = "resources/images/";

module.exports = {
  DATA_FORMAT: "googleIO",
  SCHEDULE_PATTERN_ICON_MAP: {
    googleIO: {
      "^After": IMAGE_PATH + "schedule_icon_fun.png",
      "^Badge": IMAGE_PATH + "schedule_icon_badge.png",
      "^Pre-Keynote": IMAGE_PATH + "schedule_icon_session.png",
      ".*": IMAGE_PATH + "schedule_icon_food.png"
    }
  }
};

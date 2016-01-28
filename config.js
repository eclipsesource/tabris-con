module.exports = {
  DATA_FORMAT: {id: "googleIO", sessionsHaveImages: true},
  SCHEDULE_PATTERN_ICON_MAP: {
    googleIO: {
      "^After": "schedule_icon_fun",
      "^Badge": "schedule_icon_badge",
      "^Pre-Keynote": "schedule_icon_session",
      ".*": "schedule_icon_food"
    }
  }
};

module.exports = {
  DATA_FORMAT: "googleIO",
  SESSIONS_HAVE_IMAGES: true,
  CONFERENCE_TIMEZONE: "America/Los_Angeles",
  SCHEDULE_PATTERN_ICON_MAP: {
    googleIO: {
      "^After": "schedule_icon_fun",
      "^Badge": "schedule_icon_badge",
      "^Pre-Keynote": "schedule_icon_session",
      ".*": "schedule_icon_food"
    }
  }
};

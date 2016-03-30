export default {
  DATA_SOURCE: "googleIOService",
  CONFERENCE_NAME: "Google I/O 2015",
  SERVICE_URL: "http://storage.googleapis.com/io2015-data.appspot.com/manifest_v1.json", // TODO: not implemented
  SESSIONS_HAVE_IMAGES: true,
  SUPPORTS_FEEDBACK: false,
  CONFERENCE_TIMEZONE: "America/Los_Angeles",
  SCHEDULE_PATTERN_ICON_MAP: {
    "^After": "schedule_icon_fun",
    "^Badge": "schedule_icon_badge",
    "^Pre-Keynote": "schedule_icon_session",
    "^(Lunch|Breakfast)": "schedule_icon_food",
    "^BROWSE SESSIONS": "schedule_icon_plus",
    ".*": "schedule_icon_session"
  }
};

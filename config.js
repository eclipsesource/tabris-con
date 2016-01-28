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
    },
    cod: {
      "^Lunch": "schedule_icon_food",
      ".*(Exhibit|Introduction).*": "schedule_icon_session",
      ".*Break$": "schedule_icon_break",
      "^Club": "schedule_icon_fun",
      ".*Stammtisch.*": "schedule_icon_beer",
      ".*Kahoot.*": "schedule_icon_quiz"
    }
  }
};

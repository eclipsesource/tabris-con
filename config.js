var moment = require("moment-timezone");

module.exports = {
  DATA_FORMAT: "googleIO",
  SESSIONS_HAVE_IMAGES: true,
  CONFERENCE_TIMEZONE: "America/Los_Angeles",
  CONFERENCE_SCHEDULE_HOUR_RANGE: [7, 17],
  SCHEDULE_PATTERN_ICON_MAP: {
    googleIO: {
      "^After": "schedule_icon_fun",
      "^Badge": "schedule_icon_badge",
      "^Pre-Keynote": "schedule_icon_session",
      "^(Lunch|Breakfast)": "schedule_icon_food",
      "^BROWSE SESSIONS": "schedule_icon_plus",
      ".*": "schedule_icon_session"
    },
    cod: {
      "^Lunch": "schedule_icon_food",
      ".*(Exhibit|Introduction).*": "schedule_icon_session",
      ".*Break$": "schedule_icon_break",
      "^Club": "schedule_icon_fun",
      ".*Stammtisch.*": "schedule_icon_beer",
      ".*Kahoot.*": "schedule_icon_quiz",
      "^BROWSE SESSIONS": "schedule_icon_plus",
      ".*": "schedule_icon_session"
    }
  }
};

module.exports.FREE_BLOCKS = {
  cod: [
    [dateToJSON("07.03.2016 09:00"), dateToJSON("07.03.2016 12:00")],
    [dateToJSON("07.03.2016 13:00"), dateToJSON("07.03.2016 16:00")],

    [dateToJSON("08.03.2016 09:30"), dateToJSON("08.03.2016 10:30")],
    [dateToJSON("08.03.2016 11:00"), dateToJSON("08.03.2016 11:35")],
    [dateToJSON("08.03.2016 11:45"), dateToJSON("08.03.2016 12:20")],
    [dateToJSON("08.03.2016 13:30"), dateToJSON("08.03.2016 14:05")],
    [dateToJSON("08.03.2016 14:15"), dateToJSON("08.03.2016 14:50")],
    [dateToJSON("08.03.2016 15:00"), dateToJSON("08.03.2016 15:35")],
    [dateToJSON("08.03.2016 16:15"), dateToJSON("08.03.2016 16:50")],
    [dateToJSON("08.03.2016 17:00"), dateToJSON("08.03.2016 18:00")],

    [dateToJSON("09.03.2016 09:00"), dateToJSON("09.03.2016 10:00")],
    [dateToJSON("09.03.2016 10:30"), dateToJSON("09.03.2016 11:05")],
    [dateToJSON("09.03.2016 11:15"), dateToJSON("09.03.2016 11:50")],
    [dateToJSON("09.03.2016 13:30"), dateToJSON("09.03.2016 14:05")],
    [dateToJSON("09.03.2016 14:15"), dateToJSON("09.03.2016 14:50")],
    [dateToJSON("09.03.2016 15:00"), dateToJSON("09.03.2016 15:35")],
    [dateToJSON("09.03.2016 16:15"), dateToJSON("09.03.2016 16:50")],
    [dateToJSON("09.03.2016 17:00"), dateToJSON("09.03.2016 17:35")],

    [dateToJSON("10.03.2016 09:00"), dateToJSON("10.03.2016 10:00")],
    [dateToJSON("10.03.2016 10:30"), dateToJSON("10.03.2016 11:05")],
    [dateToJSON("10.03.2016 11:15"), dateToJSON("10.03.2016 11:50")],
    [dateToJSON("10.03.2016 12:00"), dateToJSON("10.03.2016 12:35")],
    [dateToJSON("10.03.2016 13:45"), dateToJSON("10.03.2016 14:20")],
    [dateToJSON("10.03.2016 14:30"), dateToJSON("10.03.2016 15:05")]
  ]
};

function dateToJSON(date) {
  return moment.tz(date, "DD.MM.YYYY HH:mm", module.exports.CONFERENCE_TIMEZONE).toJSON();
}

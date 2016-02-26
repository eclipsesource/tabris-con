var moment = require("moment-timezone");
var timezone = "America/New_York";

module.exports = {
  DATA_FORMAT: "cod",
  VENDOR: "EclipseSource",
  VENDOR_WEBSITE: "http://eclipsesource.com/",
  CONFERENCE_NAME: "EclipseCon NA 2016",
  PROJECT_URL: "https://github.com/eclipsesource/tabris-con",
  SESSIONS_HAVE_IMAGES: false,
  CONFERENCE_TIMEZONE: timezone,
  FEEDBACK_START: date("07.03.2016 12:00"),
  FEEDBACK_DEADLINE: date("10.03.2016 16:00"),
  SERVICE_URL: "https://www.eclipsecon.org/na2016",
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
      "Break$": "schedule_icon_break",
      "Late Night$": "schedule_icon_fun",
      "^(Happy Hour|Exhibitors)": "schedule_icon_dialog",
      "^BROWSE SESSIONS": "schedule_icon_plus",
      ".*": "schedule_icon_session"
    }
  },
  TRACK_COLOR: {
    "Other Cool Stuff": "#00dedb",
    "Eclipse Platform / RCP / Runtimes": "#b56bdb",
    "Embedded": "#ff5f6a",
    "IDEs": "#a8d1ac",
    "IoT Summit": "#e88c09",
    "Java 9": "#77ed6b",
    "Languages and Tools": "#bebebe",
    "Methodology and Devops": "#fdd700",
    "Modeling": "#a08d75",
    "Science": "#00bfff",
    "Web / Mobile / Cloud Development": "#a1acff"
  },
  IGNORED_COD_BLOCKS: "^Reserved for",
  FREE_BLOCKS: {
    cod: [
      [date("07.03.2016 09:00"), date("07.03.2016 12:00")],
      [date("07.03.2016 13:00"), date("07.03.2016 16:00")],
      [date("08.03.2016 09:30"), date("08.03.2016 10:30")],
      [date("08.03.2016 11:00"), date("08.03.2016 11:35")],
      [date("08.03.2016 11:45"), date("08.03.2016 12:20")],
      [date("08.03.2016 13:30"), date("08.03.2016 14:05")],
      [date("08.03.2016 14:15"), date("08.03.2016 14:50")],
      [date("08.03.2016 15:00"), date("08.03.2016 15:35")],
      [date("08.03.2016 16:15"), date("08.03.2016 16:50")],
      [date("08.03.2016 17:00"), date("08.03.2016 18:00")],
      [date("09.03.2016 09:00"), date("09.03.2016 10:00")],
      [date("09.03.2016 10:30"), date("09.03.2016 11:05")],
      [date("09.03.2016 11:15"), date("09.03.2016 11:50")],
      [date("09.03.2016 13:30"), date("09.03.2016 14:05")],
      [date("09.03.2016 14:15"), date("09.03.2016 14:50")],
      [date("09.03.2016 15:00"), date("09.03.2016 15:35")],
      [date("09.03.2016 16:15"), date("09.03.2016 16:50")],
      [date("09.03.2016 17:00"), date("09.03.2016 17:35")],
      [date("10.03.2016 09:00"), date("10.03.2016 10:00")],
      [date("10.03.2016 10:30"), date("10.03.2016 11:05")],
      [date("10.03.2016 11:15"), date("10.03.2016 11:50")],
      [date("10.03.2016 12:00"), date("10.03.2016 12:35")],
      [date("10.03.2016 13:45"), date("10.03.2016 14:20")],
      [date("10.03.2016 14:30"), date("10.03.2016 15:05")]
    ]
  }
};

function date(simpleDate) {
  return moment.tz(simpleDate, "DD.MM.YYYY HH:mm", timezone).toJSON();
}

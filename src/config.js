let commonConfiguration = {
  DATA_SOURCE: "codService",
  VENDOR: "EclipseSource",
  VENDOR_WEBSITE: "http://eclipsesource.com/",
  CONFERENCE_NAME: "TabrisCon",
  PROJECT_URL: "https://github.com/eclipsesource/tabris-con"
};

let dataSourcePresets = {
  codService: {
    SERVICE_URL: "https://www.eclipsecon.org/na2016",
    SUPPORTS_FEEDBACK: true,
    SESSIONS_HAVE_IMAGES: false,
    CONFERENCE_TIMEZONE: "America/New_York",
    FEEDBACK_START: "07.03.2016 12:00",
    FEEDBACK_DEADLINE: "18.03.2016 23:59",
    IGNORED_BLOCKS: "^Reserved for",
    SCHEDULE_PATTERN_ICON_MAP: {
      "^Lunch": "schedule_icon_food",
      "Break$": "schedule_icon_break",
      "Late Night$": "schedule_icon_fun",
      "^(Happy Hour|Exhibitors)": "schedule_icon_dialog",
      "^BROWSE SESSIONS": "schedule_icon_plus",
      ".*": "schedule_icon_session"
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
    FREE_BLOCKS: [
      ["07.03.2016 09:00", "07.03.2016 12:00"],
      ["07.03.2016 13:00", "07.03.2016 16:00"],
      ["08.03.2016 09:30", "08.03.2016 10:30"],
      ["08.03.2016 11:00", "08.03.2016 11:35"],
      ["08.03.2016 11:45", "08.03.2016 12:20"],
      ["08.03.2016 13:30", "08.03.2016 14:05"],
      ["08.03.2016 14:15", "08.03.2016 14:50"],
      ["08.03.2016 15:00", "08.03.2016 15:35"],
      ["08.03.2016 16:15", "08.03.2016 16:50"],
      ["08.03.2016 17:00", "08.03.2016 18:00"],
      ["09.03.2016 09:00", "09.03.2016 10:00"],
      ["09.03.2016 10:30", "09.03.2016 11:05"],
      ["09.03.2016 11:15", "09.03.2016 11:50"],
      ["09.03.2016 13:30", "09.03.2016 14:05"],
      ["09.03.2016 14:15", "09.03.2016 14:50"],
      ["09.03.2016 15:00", "09.03.2016 15:35"],
      ["09.03.2016 16:15", "09.03.2016 16:50"],
      ["09.03.2016 17:00", "09.03.2016 17:35"],
      ["10.03.2016 09:00", "10.03.2016 10:00"],
      ["10.03.2016 10:30", "10.03.2016 11:05"],
      ["10.03.2016 11:15", "10.03.2016 11:50"],
      ["10.03.2016 12:00", "10.03.2016 12:35"],
      ["10.03.2016 13:45", "10.03.2016 14:20"],
      ["10.03.2016 14:30", "10.03.2016 15:05"]
    ],
    IGNORED_BLOCK_PATTERN: "^Reserved for"
  },
  googleIOService: {
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
  }
};

const CONFIGURATION = Object.freeze(
  Object.assign({}, commonConfiguration, dataSourcePresets[commonConfiguration.DATA_SOURCE])
);

export default CONFIGURATION;


import keynote from "../../json/googleIO/keynote_v2.json";
import blocks from "../../json/googleIO/blocks_v4.json";
import sessionData from "../../json/googleIO/session_data_v1.70.json";

export default {
  DATA_TYPE: "googleIO",
  CONFERENCE_NAME: "Google I/O 2015",
  SERVICES: {
    SESSIONS: "http://storage.googleapis.com/io2015-data.appspot.com/manifest_v1.json" // TODO: not implemented
  },
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
  },
  COLOR_SCHEME: {
    STATUS_BAR_BACKGROUND: "#39b2c0",
    TINT_COLOR: "#2d5a5f",
    ANDROID_ACTION_AREA_FOREGROUND_COLOR: "#ffffff",
    ANDROID_ACTION_AREA_BACKGROUND_COLOR: "#23d6ec",
    IOS_ACTION_AREA_FOREGROUND_COLOR: "#2d5a5f",
    BACKGROUND_COLOR: "#25c6da",
    INFO_TOAST_BACKGROUND_COLOR: "#323232",
    ACTION_COLOR: "#FFC107",
    ERROR_COLOR: "#F44336",
    DARK_PRIMARY_TEXT_COLOR: "rgba(0, 0, 0, 0.87)",
    DARK_SECONDARY_TEXT_COLOR: "rgba(0, 0, 0, 0.54)",
    DARK_HINT_TEXT_COLOR: "rgba(0, 0, 0, 0.38)",
    LIGHT_PRIMARY_TEXT_COLOR: "rgba(255, 255, 255, 1)",
    LIGHT_SECONDARY_TEXT_COLOR: "rgba(255, 255, 255, 0.7)",
    LIGHT_TEXT_COLOR: "#ffffff",
    ACCENTED_TEXT_COLOR: "#2d5a5f",
    LIGHT_BACKGROUND_COLOR: "#efefef",
    LINE_SEPARATOR_COLOR: "#d9d9d9",
    LINK_COLOR: "#48a8f4",
    KEYNOTE_TITLE_COLOR: "#FFC107",
    ANDROID_BUTTON_DISABLED_BACKGROUND: "#aba1d5"
  },
  BUNDLED_CONFERENCE_DATA: { keynote, blocks, sessionData }
};

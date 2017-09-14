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
    TINT_COLOR: "#2d5a5f",
    ANDROID_ACTION_AREA_FOREGROUND_COLOR: "#ffffff",
    ANDROID_ACTION_AREA_BACKGROUND_COLOR: "#23d6ec",
    IOS_ACTION_AREA_FOREGROUND_COLOR: "#2d5a5f",
    WINDOWS_ACTION_AREA_FOREGROUND_COLOR: "#ffffff",
    WINDOWS_ACTION_AREA_BACKGROUND_COLOR: "#25c6da",
    BACKGROUND_COLOR: "#25c6da",
    INFO_TOAST_BACKGROUND_COLOR: "#323232",
    ACTION_COLOR: "#FFC107",
    ERROR_COLOR: "#F44336",
    DRAWER_TEXT_COLOR: "rgba(0, 0, 0, 0.78)",
    DARK_PRIMARY_TEXT_COLOR: "rgba(0, 0, 0, 0.87)",
    DARK_SECONDARY_TEXT_COLOR: "rgba(0, 0, 0, 0.54)",
    DARK_HINT_TEXT_COLOR: "rgba(0, 0, 0, 0.38)",
    LIGHT_PRIMARY_TEXT_COLOR: "rgba(255, 255, 255, 1)",
    LIGHT_SECONDARY_TEXT_COLOR: "rgba(255, 255, 255, 0.7)",
    LIGHT_TEXT_COLOR: "#ffffff",
    ACCENTED_TEXT_COLOR: "#2d5a5f",
    LIGHT_BACKGROUND_COLOR: "#efefef",
    DRAWER_LIST_ITEM_BACKGROUND: {
      iOS: "#efefef",
      Android: "#efefef",
      windows: "#25c6da"
    },
    LINE_SEPARATOR_COLOR: "#d9d9d9",
    LINK_COLOR: "#48a8f4",
    KEYNOTE_TITLE_COLOR: "#FFC107",
    ANDROID_BUTTON_DISABLED_BACKGROUND: "#aba1d5",
    WINDOWS_DRAWER_BUTTON_BACKGROUND: "#23d6ec",
    WINDOWS_DRAWER_ICON_TINT: "#fff",
    ANDROID_DRAWER_ICON_TINT: "#757575",
    ANDROID_DRAWER_ICON_SELECTED_TINT: "#f09424"
  },
  WINDOWS_DRAWER_THEME: "dark",
  WINDOWS_DRAWER_BUTTON_THEME: "dark",
  WINDOWS_UI_TOOLBAR_THEME: "light",
  WINDOWS_UI_THEME: "light",
  BUNDLED_CONFERENCE_DATA: {
    keynote: "../json/googleIO/keynote_v2.json",
    blocks: "../json/googleIO/blocks_v4.json",
    sessionData: "../json/googleIO/session_data_v1.70.json"
  }
};

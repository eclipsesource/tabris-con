var colors = require("./colors");
var sizes = require("./sizes");
var fontToString = require("../src/fontToString");

module.exports = {
  _UI: {
    Android: {
      background: colors.BACKGROUND_COLOR,
      textColor: colors.LIGHT_PRIMARY_TEXT_COLOR
    },
    iOS: {textColor: colors.ACCENTED_TEXT_COLOR},
    UWP: {
      background: colors.BACKGROUND_COLOR,
      textColor: colors.LIGHT_PRIMARY_TEXT_COLOR,
      uwp_toolbarTheme: "dark",
      uwp_theme: "light"
    }
  },
  "#scheduleTabFolder": {
    Android: {
      background: colors.BACKGROUND_COLOR,
      textColor: "white"
    },
    iOS: {textColor: colors.ACCENTED_TEXT_COLOR},
    UWP: {}
  },
  "#sessionTitleTextView": {
    Android: {
      font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM}),
      textColor: colors.ACCENTED_TEXT_COLOR
    },
    iOS: {
      font: fontToString({weight: "normal", size: sizes.FONT_LARGE}),
      textColor: colors.DARK_PRIMARY_TEXT_COLOR
    }
  },
  "#loginTextView": {
    Android: {textColor: "white"},
    iOS: {
      alignment: "center",
      font: fontToString({weight: "bold", size: sizes.FONT_XXXLARGE}),
      textColor: colors.DARK_PRIMARY_TEXT_COLOR
    }
  },
  "#sessionPageHeader": {
    Android: {background: colors.BACKGROUND_COLOR},
    iOS: {background: "white"}
  },
  "#pageHeader": {
    Android: {background: colors.BACKGROUND_COLOR},
    iOS: {background: "white"}
  },
  "#sessionPageNavigationControls": {
    Android: {height: sizes.SESSION_HEADER_ICON},
    iOS: {height: 0}
  },
  "#sessionPageNavigationControlsBackButton": {
    Android: {height: sizes.SESSION_HEADER_ICON},
    iOS: {height: 0}
  },
  "#sessionPageNavigationControlsAttendanceButton": {
    Android: {height: sizes.SESSION_HEADER_ICON},
    iOS: {height: 0}
  },
  "#sessionPageTitleTextView": {
    Android: {
      textColor: "white",
      left: sizes.LEFT_CONTENT_MARGIN,
      top: ["#sessionPageNavigationControls", sizes.MARGIN],
      font: fontToString({weight: "bold", size: sizes.FONT_XLARGE})
    },
    iOS: {
      textColor: colors.DARK_PRIMARY_TEXT_COLOR,
      left: sizes.MARGIN_BIG,
      top: ["#sessionPageNavigationControls", sizes.MARGIN_BIG],
      font: fontToString({weight: "bold", size: sizes.FONT_XLARGE})
    }
  },
  "#sessionPageSummaryTextView": {
    Android: {
      left: sizes.LEFT_CONTENT_MARGIN,
      bottom: sizes.MARGIN_BIG,
      font: fontToString({size: sizes.FONT_LARGE}),
      textColor: "white"
    },
    iOS: {
      left: sizes.MARGIN_BIG,
      bottom: sizes.MARGIN,
      textColor: colors.DARK_SECONDARY_TEXT_COLOR,
      font: fontToString({size: sizes.FONT_MEDIUM})
    }
  },
  "#sessionPageSpeakersTextView": {
    Android: {left: sizes.LEFT_CONTENT_MARGIN},
    iOS: {left: sizes.MARGIN_BIG}
  },
  "#sessionPageDescriptionTextView": {
    Android: {
      top: sizes.MARGIN_BIG, left: sizes.LEFT_CONTENT_MARGIN,
      textColor: colors.DARK_SECONDARY_TEXT_COLOR
    },
    iOS: {
      top: 0, left: sizes.MARGIN_BIG,
      textColor: colors.DARK_PRIMARY_TEXT_COLOR
    }
  },
  "#sessionPageSpeakerSummary": {
    Android: {textColor: colors.DARK_SECONDARY_TEXT_COLOR},
    iOS: {textColor: colors.DARK_PRIMARY_TEXT_COLOR}
  },
  "#sessionPageSpeakerBio": {
    Android: {textColor: colors.DARK_SECONDARY_TEXT_COLOR},
    iOS: {textColor: colors.DARK_PRIMARY_TEXT_COLOR}
  },
  "#loginButton": {
    Android: {top: ["prev()", sizes.MARGIN], right: 0},
    iOS: {
      top: ["prev()", sizes.MARGIN], centerX: 0,
      font: fontToString({weight: "bold", size: sizes.FONT_XXXLARGE})
    }
  },
  ".input": {
    Android: {background: colors.BACKGROUND_COLOR},
    iOS: {}
  },
  ".button": {
    Android: {
      background: colors.BACKGROUND_COLOR,
      textColor: "white"
    },
    iOS: {
      background: "transparent",
      textColor: colors.ACCENTED_TEXT_COLOR
    }
  },
  ".sessionContainer": {
    Android: {left: sizes.MARGIN_BIG},
    iOS: {left: 0}
  },
  ".groupSeparator": {
    Android: {background: colors.LIGHT_BACKGROUND_COLOR},
    iOS: {background: colors.IOS_LINE_SEPARATOR_COLOR}
  },
  ".iOSLineSeparator": {
    Android: {
      visible: false
    },
    iOS: {
      visible: true
    }
  }
};

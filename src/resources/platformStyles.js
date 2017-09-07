import colors from "./colors";
import sizes from "./sizes";
import fontToString from "../helpers/fontToString";

export default {
  "#scheduleTabFolder": {
    Android: {
      background: colors.ANDROID_ACTION_AREA_BACKGROUND_COLOR,
      textColor: colors.ANDROID_ACTION_AREA_FOREGROUND_COLOR
    },
    iOS: {textColor: colors.IOS_ACTION_AREA_FOREGROUND_COLOR},
    windows: {}
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
    iOS: {background: "white"},
    windows: {background: "white"}
  },
  "#pageHeader": {
    Android: {background: colors.BACKGROUND_COLOR},
    iOS: {background: "white"},
    windows: {background: "white"}
  },
  "#sessionPageNavigationControls": {
    Android: {height: sizes.SESSION_HEADER_ICON},
    iOS: {height: 0},
    windows: {height: 0}
  },
  "#sessionPageNavigationControlsBackButton": {
    Android: {height: sizes.SESSION_HEADER_ICON},
    iOS: {height: 0},
    windows: {height: 0}
  },
  "#sessionPageNavigationControlsAttendanceButton": {
    Android: {height: sizes.SESSION_HEADER_ICON},
    iOS: {height: 0},
    windows: {height: 0}
  },
  "#sessionPageTitleTextView": {
    Android: {
      textColor: colors.ANDROID_ACTION_AREA_FOREGROUND_COLOR,
      left: sizes.LEFT_CONTENT_MARGIN,
      top: ["#sessionPageNavigationControls", sizes.MARGIN],
      font: fontToString({weight: "bold", size: sizes.FONT_XLARGE})
    },
    iOS: {
      textColor: colors.DARK_PRIMARY_TEXT_COLOR,
      left: sizes.MARGIN_XLARGE,
      top: ["#sessionPageNavigationControls", sizes.MARGIN_LARGE],
      font: fontToString({weight: "bold", size: sizes.FONT_XLARGE})
    },
    windows: {
      textColor: colors.DARK_PRIMARY_TEXT_COLOR,
      left: sizes.LEFT_CONTENT_MARGIN,
      top: ["#sessionPageNavigationControls", sizes.MARGIN_LARGE],
      font: fontToString({weight: "bold", size: sizes.FONT_XLARGE})
    }
  },
  "#sessionPageSummaryTextView": {
    Android: {
      left: sizes.LEFT_CONTENT_MARGIN,
      bottom: sizes.MARGIN_LARGE,
      font: fontToString({size: sizes.FONT_LARGE}),
      textColor: colors.ANDROID_ACTION_AREA_FOREGROUND_COLOR
    },
    iOS: {
      left: sizes.MARGIN_XLARGE,
      bottom: sizes.MARGIN_LARGE,
      textColor: colors.DARK_SECONDARY_TEXT_COLOR,
      font: fontToString({size: sizes.FONT_MEDIUM})
    },
    windows: {
      left: sizes.LEFT_CONTENT_MARGIN,
      bottom: sizes.MARGIN_LARGE,
      textColor: colors.DARK_SECONDARY_TEXT_COLOR,
      font: fontToString({size: sizes.FONT_MEDIUM})
    }
  },
  "#sessionPageFeedbackWidget": {
    Android: {left: sizes.LEFT_CONTENT_MARGIN},
    iOS: {left: sizes.MARGIN_LARGE}
  },
  "#sessionPageSpeakersTextView": {
    Android: {left: sizes.LEFT_CONTENT_MARGIN},
    iOS: {left: sizes.MARGIN_LARGE}
  },
  "#sessionPageDescriptionTextView": {
    Android: {
      top: ["#sessionPageFeedbackWidget", sizes.MARGIN_LARGE], left: sizes.LEFT_CONTENT_MARGIN,
      textColor: colors.DARK_SECONDARY_TEXT_COLOR
    },
    iOS: {
      top: ["#sessionPageFeedbackWidget", sizes.MARGIN], left: sizes.MARGIN_LARGE,
      textColor: colors.DARK_PRIMARY_TEXT_COLOR
    }
  },
  ".sessionPageHeaderTrackIndicator": {
    Android: {
      left: 0,
      right: "#sessionPageTitleTextView",
      top: sizes.SESSION_PAGE_TRACK_INDICATOR_TOP
    },
    iOS: {left: sizes.MARGIN_LARGE, top: sizes.SESSION_PAGE_TRACK_INDICATOR_TOP, bottom: sizes.MARGIN, width: 2},
    windows: {
      left: 0,
      right: "#sessionPageTitleTextView",
      top: ["#sessionPageNavigationControls", sizes.SESSION_PAGE_TRACK_INDICATOR_TOP]
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
  ".sessionItem": {
    Android: {left: sizes.MARGIN_LARGE, right: sizes.MARGIN_LARGE, top: 0},
    iOS: {left: sizes.MARGIN_LARGE, right: sizes.MARGIN_LARGE, top: 0}
  },
  ".groupSeparator": {
    Android: {background: colors.LIGHT_BACKGROUND_COLOR},
    iOS: {background: colors.LINE_SEPARATOR_COLOR}
  },
  ".feedbackIndicator": {
    Android: {top: sizes.MARGIN_LARGE},
    iOS: {top: sizes.MARGIN + sizes.MARGIN_SMALL}
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

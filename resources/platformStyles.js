var colors = require("./colors");
var sizes = require("./sizes");
var fontToString = require("../src/fontToString");

module.exports = {
  _UI: {
    Android: {
      background: colors.BACKGROUND_COLOR,
      textColor: colors.LIGHT_PRIMARY_TEXT_COLOR
    },
    iOS: {
      textColor: colors.ACCENTED_TEXT_COLOR
    }
  },
  scheduleTabFolder: {
    Android: {
      background: colors.BACKGROUND_COLOR,
      textColor: "white"
    },
    iOS: {
      textColor: colors.ACCENTED_TEXT_COLOR
    }
  },
  sessionTitleTextView: {
    Android: {
      font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM}),
      textColor: colors.ACCENTED_TEXT_COLOR
    },
    iOS: {
      font: fontToString({weight: "normal", size: sizes.FONT_LARGE}),
      textColor: colors.DARK_PRIMARY_TEXT_COLOR
    }
  }
};

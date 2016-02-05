var colors = require("./colors");
var sizes = require("./sizes");
var fontToString = require("../src/fontToString");

module.exports = {
  _UI: {
    Android: {
      background: colors.BACKGROUND_COLOR,
      textColor: colors.LIGHT_PRIMARY_TEXT_COLOR
    },
    iOS: {textColor: colors.ACCENTED_TEXT_COLOR}
  },
  "#scheduleTabFolder": {
    Android: {
      background: colors.BACKGROUND_COLOR,
      textColor: "white"
    },
    iOS: {textColor: colors.ACCENTED_TEXT_COLOR}
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
  "#pageHeader": {
    Android: {background: colors.BACKGROUND_COLOR},
    iOS: {background: "white"}
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
  "#loginButton": {
    Android: {top: "#inputContainer", right: sizes.MARGIN_BIG},
    iOS: {
      top: ["#inputContainer", sizes.MARGIN], centerX: 0,
      font: fontToString({weight: "bold", size: sizes.FONT_XXLARGE})
    }
  }
};

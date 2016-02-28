var _ = require("lodash");
var sizes = require("../resources/sizes");
var colors = require("../resources/colors");
var applyPlatformStyle = require("../helpers/applyPlatformStyle");
var fontToString = require("../helpers/fontToString");

exports.create = function(configuration) {
  var button = tabris.create("Button", _.extend({
    class: "button",
    font: fontToString({size: sizes.FONT_LARGE, weight: "bold"})
  }, configuration));
  button.on("change:enabled", updateAndroidButtonBackground);
  if (device.platform === "Android" && button.get("text")) {
    button.set("text", button.get("text").toUpperCase());
  }
  applyPlatformStyle(button);
  updateAndroidButtonBackground(button, button.get("enabled"));
  return button;
};

function updateAndroidButtonBackground(button, enabled) {
  if (device.platform === "Android") {
    button.set("background", enabled ? colors.BACKGROUND_COLOR : colors.ANDROID_BUTTON_DISABLED_BACKGROUND);
  }
}

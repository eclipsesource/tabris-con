var _ = require("lodash");
var sizes = require("../../resources/sizes");
var applyPlatformStyle = require("./applyPlatformStyle");
var fontToString = require("../fontToString");

exports.create = function(configuration) {
  var button = tabris.create("Button", _.extend({
    class: "button",
    font: fontToString({size: sizes.FONT_LARGE, weight: "bold"})
  }, configuration));
  if (device.platform === "Android" && button.get("text")) {
    button.set("text", button.get("text").toUpperCase());
  }
  applyPlatformStyle(button);
  applyPlatformStyle(button);
  return button;
};

var _ = require("lodash");
var sizes = require("../../../resources/sizes");
var colors = require("../../../resources/colors");
var fontToString = require("../../fontToString");

exports.create = function(configuration) {
  var button = tabris.create("TextView", _.extend({
    textColor: colors.ACTION_COLOR,
    highlightOnTouch: true,
    font: fontToString({size: sizes.FONT_LARGE, weight: "bold"})
  }, configuration));
  if (device.platform === "Android" && button.get("text")) {
    button.set("text", button.get("text").toUpperCase());
  }
  button.on("tap", function(widget) {
    button.trigger("select", widget);
  });
  return button;
};

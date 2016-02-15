var Circle = require("./Circle");
var sizes = require("../../resources/sizes");

exports.create = function() {
  var indicator;
  if (device.platform === "iOS") {
    indicator = tabris.create("Composite", {
      left: sizes.MARGIN_LARGE, top: sizes.MARGIN, bottom: sizes.MARGIN, width: 2
    }).on("change:color", function(widget, color) {widget.set("background", color);});
  } else {
    indicator = tabris.create("Composite", {
      left: 0,
      right: "#sessionPageTitleTextView",
      top: ["#sessionPageNavigationControls", sizes.MARGIN + 2]
    });
    var circle = Circle.create({
      centerX: 0,
      top: 0,
      radius: sizes.TRACK_CIRCLE_RADIUS
    }).appendTo(indicator);
    indicator.on("change:color", function(widget, color) {circle.set("color", color);});
  }
  return indicator;
};

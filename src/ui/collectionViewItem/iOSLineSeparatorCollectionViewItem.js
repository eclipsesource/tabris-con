var sizes = require("../../../resources/sizes");
var colors = require("../../../resources/colors");
var applyPlatformStyle = require("../applyPlatformStyle");

module.exports = {
  itemHeight: sizes.CELL_TYPE_SMALL_SEPARATOR_HEIGHT,
  initializeCell: function(cell) {
    var separator = tabris.create("Composite", {
      class: "iOSLineSeparator",
      left: sizes.MARGIN_BIG, top: 0, right: 0, bottom: 0,
      background: colors.IOS_LINE_SEPARATOR_COLOR
    }).appendTo(cell);
    applyPlatformStyle(separator);
  },
  select: function() {}
};

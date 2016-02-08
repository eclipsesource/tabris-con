var sizes = require("../../../resources/sizes");
var applyPlatformStyle = require("../applyPlatformStyle");

module.exports = {
  itemHeight: sizes.CELL_TYPE_SEPARATOR_HEIGHT[device.platform],
  initializeCell: function(cell) {
    var separator = tabris.create("Composite", {
      class: "groupSeparator",
      left: 0, top: 0, right: 0, bottom: 0
    }).appendTo(cell);
    applyPlatformStyle(separator);
  },
  select: function() {}
};

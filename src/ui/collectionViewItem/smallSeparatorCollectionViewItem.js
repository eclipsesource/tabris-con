var sizes = require("../../../resources/sizes");
var colors = require("../../../resources/colors");

module.exports = {
  itemHeight: sizes.CELL_TYPE_SMALL_SEPARATOR_HEIGHT,
  initializeCell: function(cell) {
    cell.set("background", colors.LIGHT_BACKGROUND_COLOR);
  },
  select: function() {}
};

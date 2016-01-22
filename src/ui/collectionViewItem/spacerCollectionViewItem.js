var sizes = require("../../../resources/sizes");

module.exports = {
  itemHeight: sizes.CELL_TYPE_SPACER_HEIGHT,
  initializeCell: function(cell) {
    cell.set("background", "white");
  },
  select: function() {}
};

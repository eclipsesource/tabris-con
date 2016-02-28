var sizes = require("../../resources/sizes");

module.exports = {
  itemHeight: sizes.CELL_TYPE_SESSIONS_SPACER_HEIGHT[device.platform],
  initializeCell: function(cell) {
    cell.set("background", "white");
  },
  select: function() {}
};

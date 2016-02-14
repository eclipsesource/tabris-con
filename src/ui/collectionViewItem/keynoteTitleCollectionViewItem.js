var sizes = require("../../../resources/sizes");
var colors = require("../../../resources/colors");
var SessionTitle = require("./SessionTitle");

module.exports = {
  itemHeight: sizes.SESSION_CATEGORY_TITLE_CELL_HEIGHT,
  initializeCell: function(cell) {
    var title = SessionTitle.create({background: "white", textColor: colors.KEYNOTE_TITLE_COLOR}).appendTo(cell);
    cell.on("change:item", function(cell, item) {
      title.set("text", item.title);
    });
  },
  select: function() {}
};

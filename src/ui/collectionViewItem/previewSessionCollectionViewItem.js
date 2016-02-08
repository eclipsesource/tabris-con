var sessionCollectionViewItem = require("./sessionCollectionViewItem.js");
var sizes = require("../../../resources/sizes");
var SessionContainer = require("./SessionContainer");

module.exports = {
  itemHeight: getCellHeight(),
  initializeCell: function(cell) {
    var session = SessionContainer.create({height: getCellHeight()}).appendTo(cell);
    cell.on("change:item", function(cell, item) {
      session.set("data", item);
    });
  },
  select: sessionCollectionViewItem.select
};

function getCellHeight() {
  return sizes.PREVIEW_SESSION_CELL_HEIGHT;
}

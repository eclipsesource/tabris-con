var sizes = require("../../../resources/sizes");
var viewDataProvider = require("../../data/viewDataProvider");
var SessionPage = require("../page/SessionPage");
var SessionContainer = require("./SessionContainer");

module.exports = {
  itemHeight: getCellHeight(),
  initializeCell: function(cell) {
    var session = SessionContainer.create({height: getCellHeight()}).appendTo(cell);
    cell.on("change:item", function(cell, item) {
      session.set("data", item);
    });
  },
  select: function(widget, item) {
    var sessionPage = SessionPage.create().open();
    var session = viewDataProvider.getKeynote(item.id);
    sessionPage.set("data", session);
  }
};

function getCellHeight() {
  return sizes.PREVIEW_SESSION_CELL_HEIGHT;
}

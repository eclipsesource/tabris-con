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
    viewDataProvider.asyncGetSession(item.id)
      .then(function(session) {
        sessionPage.set("data", session);
      });
  }
};

function getCellHeight() {
  return sizes.SESSION_CELL_HEIGHT[device.platform];
}

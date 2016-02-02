var sizes = require("../../../resources/sizes");
var fontToString = require("../../fontToString");
var viewDataProvider = require("../../data/viewDataProvider");
var colors = require("../../../resources/colors");
var SessionsPage = require("../page/SessionsPage");

module.exports = {
  itemHeight: sizes.SESSION_CATEGORY_TITLE_CELL_HEIGHT,
  initializeCell: function(cell) {
    var header = tabris.create("Composite", {
      left: 0, top: 0, right: 0, height: sizes.SESSION_CATEGORY_TITLE_CELL_HEIGHT
    }).appendTo(cell);
    var titleTextView = tabris.create("TextView", {
      left: sizes.MARGIN_BIG, centerY: 0, right: ["#moreTextView", sizes.MARGIN],
      maxLines: 1,
      font: fontToString({weight: "bold", size: sizes.FONT_XLARGE})
    }).appendTo(header);
    tabris.create("TextView", {
      id: "moreTextView",
      right: sizes.MARGIN_BIG, centerY: 0,
      textColor: colors.ACCENTED_TEXT_COLOR,
      font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM}),
      text: "MORE"
    }).appendTo(header);
    cell.on("change:item", function(cell, item) {
      titleTextView.set("text", item.title);
    });
  },
  select: function(widget, item) {
    var page = SessionsPage.create().open();

    viewDataProvider.asyncGetCategory(item.id)
      .then(function(category) {
        page.set("data", {title: item.title, items: category});
      });
  }
};

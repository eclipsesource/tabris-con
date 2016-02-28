var sizes = require("../../resources/sizes");
var fontToString = require("../../helpers/fontToString");
var viewDataProvider = require("../../viewDataProvider");
var colors = require("../../resources/colors");
var SessionsPage = require("../../pages/SessionsPage");
var SessionTitle = require("../../components/SessionTitle");

module.exports = {
  itemHeight: sizes.SESSION_CATEGORY_TITLE_CELL_HEIGHT,
  initializeCell: function(cell) {
    var title = SessionTitle.create().appendTo(cell);
    tabris.create("TextView", {
      id: "moreTextView",
      alignment: "right",
      width: 50, right: sizes.MARGIN_LARGE, centerY: 0,
      textColor: colors.ACCENTED_TEXT_COLOR,
      font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM}),
      text: "MORE"
    }).appendTo(title);
    cell.on("change:item", function(cell, item) {
      title.set("text", item.title);
    });
  },
  select: function(widget, item) {
    var page = SessionsPage.create().open();

    viewDataProvider.getCategory(item.id)
      .then(function(category) {
        page.set("data", {title: item.title, items: category});
      });
  }
};

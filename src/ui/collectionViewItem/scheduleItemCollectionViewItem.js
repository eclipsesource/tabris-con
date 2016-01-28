var sizes = require("../../../resources/sizes");
var fontToString = require("../../fontToString");
var colors = require("../../../resources/colors");
var getImage = require("../../getImage");

module.exports = {
  itemHeight: sizes.SCHEDULE_PAGE_ITEM_HEIGHT,
  initializeCell: function(cell) {
    var textContainer = tabris.create("Composite", {
      left: sizes.LEFT_CONTENT_MARGIN, top: 0, right: sizes.MARGIN_BIG
    }).appendTo(cell);

    var startTimeTextView = tabris.create("TextView", {
      textColor: colors.DARK_SECONDARY_TEXT_COLOR,
      font: fontToString({weight: "bold", size: sizes.FONT_XLARGE}),
      left: 0, top: sizes.MARGIN_BIG, right: 0
    }).appendTo(textContainer);

    var titleTextView = tabris.create("TextView", {
      textColor: colors.ACCENTED_TEXT_COLOR,
      font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM}),
      left: 0, top: ["prev()", sizes.MARGIN_BIG], right: 0
    }).appendTo(textContainer);

    var summaryTextView = tabris.create("TextView", {
      left: 0, top: ["prev()", sizes.MARGIN], right: 0,
      textColor: colors.DARK_SECONDARY_TEXT_COLOR,
      maxLines: 2,
      font: fontToString({size: sizes.FONT_MEDIUM})
    }).appendTo(textContainer);

    var imageView = tabris.create("ImageView", {
      left: 0, right: textContainer, centerY: 0
    }).appendTo(cell);

    cell.on("change:item", function(widget, item) {
      startTimeTextView.set("text", item.startTime);
      titleTextView.set("text", item.title);
      summaryTextView.set("text", item.summary);
      imageView.set("image", getImage(item.image));
    });
  },
  select: function() {}
};

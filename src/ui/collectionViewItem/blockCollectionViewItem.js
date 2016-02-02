var sizes = require("../../../resources/sizes");
var fontToString = require("../../fontToString");
var colors = require("../../../resources/colors");
var getImage = require("../../getImage");
var viewDataProvider = require("../../data/viewDataProvider");
var SessionPage = require("../../ui/page/SessionPage");
var SessionsPage = require("../../ui/page/SessionsPage");
var TimezonedDate = require("../../TimezonedDate");

module.exports = {
  itemHeight: sizes.SCHEDULE_PAGE_ITEM_HEIGHT,
  initializeCell: function(cell) {
    var circleCanvas = tabris.create("Canvas", {
      left: sizes.MARGIN, centerY: 0, width: 12, height: 12,
      visible: false
    }).appendTo(cell);

    drawCircle(circleCanvas);

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
      circleCanvas.set("visible", !!item.sessionId);
      startTimeTextView.set("text", item.startTime);
      titleTextView.set("text", item.title);
      summaryTextView.set("text", item.sessionType !== "free" ? item.summary : "");
      imageView.set("image", getImage(item.image));
    });
  },
  select: function(widget, item) {
    if (item.sessionId) {
      var sessionPage = SessionPage.create().open();
      viewDataProvider.asyncGetSession(item.sessionId)
        .then(function(session) {
          sessionPage.set("data", session);
        });
    } else if (item.sessionType === "free") {
      var page = SessionsPage.create().open();
      var date1 = new TimezonedDate(item.startTimestamp);
      var date2 = new TimezonedDate(item.endTimestamp);
      viewDataProvider.asyncGetSessionsStartingInTimeframe(date1.toJSON(), date2.toJSON())
        .then(function(sessions) {
          var from = date1.format("HH:mm");
          var to = date2.format("HH:mm");
          page.set("data", {title: from + " - " + to, items: sessions});
        });
    }
  }
};

function drawCircle(canvas) {
  var ctx = canvas.getContext("2d", sizes.BLOCK_CIRCLE_SIZE, sizes.BLOCK_CIRCLE_SIZE);
  ctx.arc(sizes.BLOCK_CIRCLE_SIZE / 2, sizes.BLOCK_CIRCLE_SIZE / 2, sizes.BLOCK_CIRCLE_SIZE / 4, 0, 2 * Math.PI);
  ctx.fillStyle = colors.BACKGROUND_COLOR;
  ctx.fill();
}

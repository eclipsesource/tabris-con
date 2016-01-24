var SessionPage = require("../../pages/SessionPage");
var sizes = require("../../../resources/sizes");
var fontToString = require("../../fontToString");
var colors = require("../../../resources/colors");
var viewDataProvider = require("../../data/viewDataProvider");
var getImage = require("../../getImage");

module.exports = {
  itemHeight: sizes.SESSION_CELL_HEIGHT,
  initializeCell: function(cell) {
    var session = createSession().appendTo(cell);
    cell.on("change:item", function(cell, item) {
      session.set("data", item);
    });
  },
  select: sessionSelectCallback
};

function createSession() {
  var categorySession = tabris.create("Composite", {
    left: sizes.MARGIN_BIG, right: sizes.MARGIN_BIG, top: 0, height: sizes.SESSION_CELL_HEIGHT
  }).on("change:data", function(widget, data) {
    var image = getImage(data.image, sizes.SESSION_CELL_IMAGE_WIDTH, sizes.SESSION_CELL_IMAGE_HEIGHT);
    imageView.set("image", image);
    titleTextView.set("text", data.title);
    summaryTextView.set("text", data.summary);
  });
  var imageView = createSessionImage().appendTo(categorySession);
  var titleTextView = createSessionTitleTextView().appendTo(categorySession);
  var summaryTextView = tabris.create("TextView", {
    layoutData: {left: [imageView, sizes.MARGIN_BIG], top: [titleTextView, sizes.MARGIN_XSMALL]},
    font: fontToString({size: sizes.FONT_MEDIUM}),
    maxLines: 2,
    textColor: colors.DARK_SECONDARY_TEXT_COLOR
  }).appendTo(categorySession);
  return categorySession;
}

function createSessionImage() {
  return tabris.create("ImageView", {
    id: "imageView",
    centerY: 0, width: sizes.SESSION_CELL_IMAGE_WIDTH, height: sizes.SESSION_CELL_IMAGE_HEIGHT,
    scaleMode: "fill"
  });
}

function createSessionTitleTextView() {
  return tabris.create("TextView", {
    layoutData: {left: ["prev()", sizes.MARGIN_BIG], top: sizes.MARGIN, right: sizes.MARGIN},
    font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM}),
    maxLines: 2,
    textColor: colors.ACCENTED_TEXT_COLOR
  });
}

function sessionSelectCallback(widget, item) {
  var sessionPage = SessionPage.create().open();
  viewDataProvider.asyncGetSession(item.id)
    .then(function(session) {
      sessionPage.set("data", session);
    });
}

var sizes = require("../../../resources/sizes");
var fontToString = require("../../fontToString");
var colors = require("../../../resources/colors");
var config = require("../../../config");
var getImage = require("../../getImage");
var viewDataProvider = require("../../data/viewDataProvider");
var SessionPage = require("../../pages/SessionPage");
var _ = require("lodash");

module.exports = {
  itemHeight: sizes.SESSION_CELL_HEIGHT,
  initializeCell: function(cell) {
    var session = createSession().appendTo(cell);
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

function createSession() {
  var categorySession = tabris.create("Composite", {
    left: sizes.MARGIN_BIG, right: sizes.MARGIN_BIG, top: 0, height: sizes.SESSION_CELL_HEIGHT
  });
  if (config.SESSIONS_HAVE_IMAGES) {
    var imageView = createSessionImage().appendTo(categorySession);
  }
  var textContainer = tabris.create("Composite", _.extend({
      left: ["#imageView", sizes.MARGIN_BIG], right: sizes.MARGIN_SMALL
    }, config.SESSIONS_HAVE_IMAGES ? {top: sizes.MARGIN} : {centerY: 0})
  ).appendTo(categorySession);
  var titleTextView = createSessionTitleTextView().appendTo(textContainer);
  var summaryTextView = tabris.create("TextView", {
    left: 0, top: [titleTextView, sizes.MARGIN_XSMALL], right: 0,
    font: fontToString({size: sizes.FONT_MEDIUM}),
    maxLines: 2,
    textColor: colors.DARK_SECONDARY_TEXT_COLOR
  }).appendTo(textContainer);
  categorySession.on("change:data", function(widget, data) {
    if (config.SESSIONS_HAVE_IMAGES) {
      var image = getImage(data.image, sizes.SESSION_CELL_IMAGE_WIDTH, sizes.SESSION_CELL_IMAGE_HEIGHT);
      imageView.set("image", image);
    }
    titleTextView.set("text", data.title);
    summaryTextView.set("text", data.summary);
  });
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
    left: 0, top: 0, right: 0,
    font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM}),
    maxLines: 1,
    textColor: colors.ACCENTED_TEXT_COLOR
  });
}

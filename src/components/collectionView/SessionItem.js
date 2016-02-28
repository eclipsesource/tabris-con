var fontToString = require("../../helpers/fontToString");
var colors = require("../../resources/colors");
var sizes = require("../../resources/sizes");
var config = require("../../../config");
var getImage = require("../../helpers/getImage");
var applyPlatformStyle = require("../../helpers/applyPlatformStyle");
var _ = require("lodash");

exports.create = function(configuration) {
  var sessionItem = tabris.create("Composite", _.extend({class: "sessionItem"}, configuration));
  applyPlatformStyle(sessionItem);
  if (config.SESSIONS_HAVE_IMAGES) {
    var imageView = createSessionImage().appendTo(sessionItem);
  }
  var trackIndicator = tabris.create("Composite", {
    left: 0, top: sizes.MARGIN, bottom: sizes.MARGIN, width: 2, background: "red"
  }).appendTo(sessionItem);
  var textContainer = tabris.create("Composite", _.extend({
      left: ["prev()", sizes.MARGIN_LARGE * 0.8], right: sizes.MARGIN_SMALL
    }, config.SESSIONS_HAVE_IMAGES ? {top: sizes.MARGIN} : {centerY: 0})
  ).appendTo(sessionItem);
  applyPlatformStyle(textContainer);
  var titleTextView = createSessionTitleTextView().appendTo(textContainer);
  applyPlatformStyle(titleTextView);
  var summaryTextView = tabris.create("TextView", {
    left: 0, top: [titleTextView, sizes.MARGIN_XSMALL], right: 0,
    font: fontToString({size: sizes.FONT_MEDIUM}),
    maxLines: 2,
    textColor: colors.DARK_SECONDARY_TEXT_COLOR
  }).appendTo(textContainer);
  sessionItem.on("change:data", function(widget, data) {
    if (config.SESSIONS_HAVE_IMAGES) {
      var image = getImage.forDevicePlatform(
        data.image,
        sizes.SESSION_CELL_IMAGE_WIDTH,
        sizes.SESSION_CELL_IMAGE_HEIGHT
      );
      imageView.set("image", image);
    }
    trackIndicator.set("background", config.TRACK_COLOR[data.categoryName] || "initial");
    titleTextView.set("text", data.title);
    summaryTextView.set("text", data.summary);
  });
  return sessionItem;
};

function createSessionImage() {
  return tabris.create("ImageView", {
    id: "imageView",
    centerY: 0, width: sizes.SESSION_CELL_IMAGE_WIDTH, height: sizes.SESSION_CELL_IMAGE_HEIGHT,
    scaleMode: "fill"
  });
}

function createSessionTitleTextView() {
  return tabris.create("TextView", {
    id: "sessionTitleTextView",
    left: 0, top: 0, right: 0,
    maxLines: 1
  });
}

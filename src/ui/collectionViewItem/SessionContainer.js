var fontToString = require("../../fontToString");
var colors = require("../../../resources/colors");
var sizes = require("../../../resources/sizes");
var config = require("../../../config");
var getImage = require("../../getImage");
var applyPlatformStyle = require("../applyPlatformStyle");
var _ = require("lodash");

exports.create = function(configuration) {
  var sessionContainer = tabris.create("Composite", _.extend({
    class: "sessionContainer",
    right: sizes.MARGIN_BIG, top: 0
  }, configuration));
  applyPlatformStyle(sessionContainer);
  if (config.SESSIONS_HAVE_IMAGES) {
    var imageView = createSessionImage().appendTo(sessionContainer);
  }
  var textContainer = tabris.create("Composite", _.extend({
      left: ["#imageView", sizes.MARGIN_BIG], right: sizes.MARGIN_SMALL
    }, config.SESSIONS_HAVE_IMAGES ? {top: sizes.MARGIN} : {centerY: 0})
  ).appendTo(sessionContainer);
  var titleTextView = createSessionTitleTextView().appendTo(textContainer);
  applyPlatformStyle(titleTextView);
  var summaryTextView = tabris.create("TextView", {
    left: 0, top: [titleTextView, sizes.MARGIN_XSMALL], right: 0,
    font: fontToString({size: sizes.FONT_MEDIUM}),
    maxLines: 2,
    textColor: colors.DARK_SECONDARY_TEXT_COLOR
  }).appendTo(textContainer);
  sessionContainer.on("change:data", function(widget, data) {
    if (config.SESSIONS_HAVE_IMAGES) {
      var image = getImage.forDevicePlatform(
        data.image,
        sizes.SESSION_CELL_IMAGE_WIDTH,
        sizes.SESSION_CELL_IMAGE_HEIGHT
      );
      imageView.set("image", image);
    }
    titleTextView.set("text", data.title);
    summaryTextView.set("text", data.summary);
  });
  return sessionContainer;
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

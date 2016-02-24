var addProgressTo = require("./addProgressTo");
var fontToString = require("../fontToString");
var sizes = require("../../resources/sizes");
var applyPlatformStyle = require("./applyPlatformStyle");
var colors = require("../../resources/colors");

exports.create = function(text, image) {
  var listItem = tabris.create("Composite", {
    left: 0, top: "prev()", right: 0, height: sizes.DRAWER_LIST_ITEM_HEIGHT,
    highlightOnTouch: true,
    progress: false
  });
  addProgressTo(listItem);
  var drawerIconImageView = tabris.create("ImageView", {
    class: "drawerIconImageView", image: image,
    centerY: 0
  }).appendTo(listItem);
  applyPlatformStyle(drawerIconImageView);
  var drawerTitleTextView = tabris.create("TextView", {
    class: "drawerTitleTextView",
    text: text,
    font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM}),
    left: sizes.LEFT_CONTENT_MARGIN, centerY: 0,
    textColor: colors.DRAWER_TEXT_COLOR
  }).appendTo(listItem);
  applyPlatformStyle(drawerTitleTextView);
  return listItem;
};

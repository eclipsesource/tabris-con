var addProgressTo = require("../helpers/addProgressTo");
var fontToString = require("../helpers/fontToString");
var sizes = require("../resources/sizes");
var applyPlatformStyle = require("../helpers/applyPlatformStyle");
var colors = require("../resources/colors");

exports.create = function(text, image) {
  var listItem = new tabris.Composite({
    left: 0, top: "prev()", right: 0, height: sizes.DRAWER_LIST_ITEM_HEIGHT,
    highlightOnTouch: true,
    progress: false
  });
  addProgressTo(listItem);
  var drawerIconImageView = new tabris.ImageView({
    class: "drawerIconImageView", image: image,
    centerY: 0
  }).appendTo(listItem);
  applyPlatformStyle(drawerIconImageView);
  var drawerTitleTextView = new tabris.TextView({
    class: "drawerTitleTextView",
    text: text,
    font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM}),
    left: sizes.LEFT_CONTENT_MARGIN, centerY: 0,
    textColor: colors.DRAWER_TEXT_COLOR
  }).appendTo(listItem);
  applyPlatformStyle(drawerTitleTextView);
  return listItem;
};

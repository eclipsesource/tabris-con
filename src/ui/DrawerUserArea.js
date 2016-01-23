var colors = require("../../resources/colors");
var sizes = require("../../resources/sizes");
var fontToString = require("../fontToString");
var getImage = require("../getImage");

exports.create = function() {
  var userArea = tabris.create("Composite", {
    id: "userArea",
    layoutData: {left: 0, top: 0, right: 0, height: sizes.DRAWER_USER_AREA_HEIGHT},
    background: colors.BACKGROUND_COLOR
  });
  var userTextContainer = tabris.create("Composite", {
    left: sizes.MARGIN_BIG,
    bottom: 0,
    right: sizes.MARGIN_BIG,
    height: sizes.DRAWER_USER_TEXT_CONTAINER_HEIGHT
  }).appendTo(userArea);
  tabris.create("TextView", {
    top: sizes.MARGIN,
    text: "John Smith",
    textColor: "white",
    font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM})
  }).appendTo(userTextContainer);
  tabris.create("TextView", {
    bottom: sizes.MARGIN,
    text: "jsmith@me.com",
    textColor: "white",
    font: fontToString({size: sizes.FONT_MEDIUM})
  }).appendTo(userTextContainer);
  tabris.create("ImageView", {
    id: "menuArrowImageView",
    image: getImage("menu_down"),
    layoutData: {centerY: 0, right: 0}
  }).appendTo(userTextContainer);
  return userArea;
};

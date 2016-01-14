var colors = require("../../resources/colors.json");

exports.create = function() {
  var userArea = tabris.create("Composite", {
    id: "userArea",
    layoutData: {left: 0, top: 0, right: 0, height: 120},
    background: colors.BACKGROUND_COLOR
  });
  var userSubtitle = tabris.create("Composite", {
    left: 16, bottom: 0, right: 16, height: 56
  }).appendTo(userArea);
  tabris.create("TextView", {
    top: 8,
    text: "John Smith",
    textColor: "white",
    font: "bold 14px"
  }).appendTo(userSubtitle);
  tabris.create("TextView", {
    bottom: 8,
    text: "jsmith@me.com",
    textColor: "white",
    font: "14px"
  }).appendTo(userSubtitle);
  tabris.create("ImageView", {
    id: "menuArrowImageView",
    image: {src: "resources/images/menu_down.png", scale: 2},
    layoutData: {centerY: 0, right: 0}
  }).appendTo(userSubtitle);
  return userArea;
};

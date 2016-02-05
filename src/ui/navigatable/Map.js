var getImage = require("../../getImage");
var Navigatable = require("./Navigatable");
var fontToString = require("../../fontToString");
var sizes = require("../../../resources/sizes");

exports.create = function() {
  var map = Navigatable.create({
    id: "map",
    title: "Map",
    image: getImage("map"),
    left: 0, top: 0, right: 0, bottom: 0
  });
  tabris.create("TextView", {
    font: fontToString({size: sizes.FONT_XXLARGE, weight: "bold"}),
    text: "TBD",
    centerX: 0, centerY: 0
  }).appendTo(map);
  return map;
};

var getImage = require("../../getImage");
var Navigatable = require("./Navigatable");

exports.create = function() {
  return Navigatable.create({
    id: "map",
    title: "Map",
    image: getImage("map"),
    left: 0, top: 0, right: 0, bottom: 0
  });
};

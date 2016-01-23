var getImage = require("../getImage");

exports.create = function() {
  return tabris.create("Page", {
    id: "mapPage",
    topLevel: true,
    title: "Map",
    image: getImage("map")
  });
};

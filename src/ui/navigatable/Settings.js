var getImage = require("../../getImage");
var Navigatable = require("./Navigatable");

exports.create = function() {
  return Navigatable.create({
    id: "settings",
    title: "Settings",
    image: getImage("settings"),
    left: 0, top: 0, right: 0, bottom: 0
  });
};

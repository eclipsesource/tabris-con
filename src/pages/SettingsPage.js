var getImage = require("../getImage");

exports.create = function() {
  return tabris.create("Page", {
    id: "settingsPage",
    topLevel: true,
    title: "Settings",
    image: getImage("settings")
  });
};

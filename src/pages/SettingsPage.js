var sizes = require("../../resources/sizes");

exports.create = function() {
  return tabris.create("Page", {
    id: "settingsPage",
    topLevel: true,
    title: "Settings",
    image: {src: "resources/images/settings.png", scale: sizes.ICON_SCALE}
  });
};

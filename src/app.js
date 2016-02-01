require("tabris-js-node");
var Navigation = require("./ui/Navigation");
var colors = require("../resources/colors");

tabris.ui.set("background", colors.BACKGROUND_COLOR);
tabris.ui.set("textColor", colors.LIGHT_PRIMARY_TEXT_COLOR);

Navigation[device.platform].create();

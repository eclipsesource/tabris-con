require("tabris-js-node");
var Navigation = require("./ui/Navigation");
var applyPlatformStyle = require("./ui/applyPlatformStyle");
applyPlatformStyle(tabris.ui);
Navigation[device.platform].create();

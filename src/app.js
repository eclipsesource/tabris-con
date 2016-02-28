require("tabris-js-node");
require("./w10exts");

var Navigation = require("./components/Navigation");
var applyPlatformStyle = require("./helpers/applyPlatformStyle");
var LoginAction = require("./actions/LoginAction");

applyPlatformStyle(tabris.ui);

Navigation[device.platform].create();
if (device.platform === "iOS") {
  LoginAction.create();
}

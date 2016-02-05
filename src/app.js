require("tabris-js-node");
var Navigation = require("./ui/Navigation");
var applyPlatformStyle = require("./ui/applyPlatformStyle");
var LoginAction = require("./ui/LoginAction");

applyPlatformStyle(tabris.ui);

Navigation[device.platform].create();
if (device.platform === "iOS") {
  LoginAction.create();
}

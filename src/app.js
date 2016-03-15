require("tabris-js-node");
require("./w10exts");
var config = require("../config");
var moment = require("moment-timezone");
moment.locale(config.DATE_LOCALE);

var Navigation = require("./components/Navigation");
var applyPlatformStyle = require("./helpers/applyPlatformStyle");
var LoginAction = require("./actions/LoginAction");

applyPlatformStyle(tabris.ui);

Navigation.create();
if (device.platform === "iOS") {
  LoginAction.create();
}

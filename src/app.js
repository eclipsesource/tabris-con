/*jshint nonew: false*/
import "tabris-js-node";
import "./w10exts";
import "promise.prototype.finally";
import config from "./config";
import moment from "moment-timezone";
import * as NavigationFactory from "./components/NavigationFactory";
import applyPlatformStyle from "./helpers/applyPlatformStyle";
import LoginAction from "./actions/LoginAction";

moment.locale(config.DATE_LOCALE);
applyPlatformStyle(tabris.ui);

NavigationFactory.create(config);
if (device.platform === "iOS") {
  new LoginAction();
}

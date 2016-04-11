/*jshint nonew: false*/
import "tabris-js-node";
import "./w10exts";
import "promise.prototype.finally";
import config from "./configs/config";
import moment from "moment-timezone";
import * as NavigationFactory from "./components/NavigationFactory";
import applyPlatformStyle from "./helpers/applyPlatformStyle";
import LoginAction from "./actions/LoginAction";
import * as RemoteServiceFactory from "./RemoteServiceFactory";
import * as FeedbackServiceFactory from "./helpers/FeedbackServiceFactory";
import * as LoginServiceFactory from "./helpers/LoginServiceFactory";

moment.locale(config.DATE_LOCALE);
applyPlatformStyle(tabris.ui);

let remoteService = RemoteServiceFactory.create();
let feedbackService = FeedbackServiceFactory.create(remoteService);
let loginService = LoginServiceFactory.create(remoteService);

NavigationFactory.create(config, remoteService, loginService, feedbackService);
if (device.get("platform") === "iOS" && config.SUPPORTS_FEEDBACK) {
  new LoginAction(loginService);
}

/*jshint nonew: false*/
import "tabris-js-node";
import "promise.prototype.finally";
import config from "./configs/config";
import moment from "moment-timezone";
import * as NavigationFactory from "./components/NavigationFactory";
import applyPlatformStyle from "./helpers/applyPlatformStyle";
import LoginAction from "./actions/LoginAction";
import * as RemoteServiceFactory from "./RemoteServiceFactory";
import * as FeedbackServiceFactory from "./helpers/FeedbackServiceFactory";
import * as LoginServiceFactory from "./helpers/LoginServiceFactory";
import {device} from "tabris";

const FALLBACK_MOMENT_LOCALE = "en-US";

applyPlatformStyle(tabris.ui);
setMomentLocale();

let remoteService = RemoteServiceFactory.create();
let feedbackService = FeedbackServiceFactory.create(remoteService);
let loginService = LoginServiceFactory.create(remoteService);

NavigationFactory.create(config, remoteService, loginService, feedbackService);
if (device.get("platform") === "iOS" && config.SUPPORTS_FEEDBACK) {
  new LoginAction(loginService);
}

function setMomentLocale() {
  let deviceLanguage = device.get("language");
  let momentLocale = getMomentLocale(deviceLanguage);
  moment.locale(momentLocale);
}

function getMomentLocale(deviceLanguage) {
  let supportedLanguageSubTags = ["de", "en"];
  if (deviceLanguage) {
    let primaryLanguageSubTag = deviceLanguage.split("-")[0];
    return supportedLanguageSubTags.indexOf(primaryLanguageSubTag) > -1 ?
      device.get("language") : FALLBACK_MOMENT_LOCALE;
  }
  return FALLBACK_MOMENT_LOCALE; // TODO: Windows client doesn't provide a locale.
}

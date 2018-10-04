import "promise.prototype.finally";
import config from "./configs/config";
import moment from "moment-timezone";
import ProfileAction from "./actions/ProfileAction";
import MainPage from "./pages/MainPage";
import * as RemoteServiceFactory from "./RemoteServiceFactory";
import * as FeedbackServiceFactory from "./helpers/FeedbackServiceFactory";
import * as LoginServiceFactory from "./helpers/LoginServiceFactory";
import * as ViewDataProviderFactory from "./ViewDataProviderFactory";
import {device} from "tabris";
import {pageNavigation} from "./pages/navigation";
import * as ui from "./helpers/ui";

const FALLBACK_MOMENT_LOCALE = "en-US";

setMomentLocale();
ui.initialize();
startApp();

function setMomentLocale() {
  let deviceLanguage = device.language;
  let momentLocale = getMomentLocale(deviceLanguage);
  moment.locale(momentLocale);
}

function getMomentLocale(deviceLanguage) {
  let supportedLanguageSubTags = ["de", "en"];
  if (deviceLanguage) {
    let primaryLanguageSubTag = deviceLanguage.split("-")[0];
    return supportedLanguageSubTags.indexOf(primaryLanguageSubTag) > -1 ?
      device.language : FALLBACK_MOMENT_LOCALE;
  }
  return FALLBACK_MOMENT_LOCALE;
}

function startApp() {
  let remoteService = RemoteServiceFactory.create();
  let feedbackService = FeedbackServiceFactory.create(remoteService);
  let loginService = LoginServiceFactory.create(remoteService);
  let viewDataProvider = ViewDataProviderFactory.create(config, remoteService, loginService, feedbackService);

  new MainPage({viewDataProvider, loginService, feedbackService})
    .on("appear", () => {
      if (config.SUPPORTS_FEEDBACK && loginService.isLoggedIn()) {
        new ProfileAction(loginService).appendTo(pageNavigation);
      }
    })
    .on("disappear", () => pageNavigation.find("#profileAction").dispose())
    .appendTo(pageNavigation);
}

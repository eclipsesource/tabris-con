import "promise.prototype.finally";
import config from "./configs/config";
import moment from "moment-timezone";
import ProfileAction from "./actions/ProfileAction";
import MainPage from "./pages/MainPage";
import {device} from "tabris";
import {pageNavigation} from "./pages/navigation";
import * as ui from "./helpers/ui";
import { resolve } from "tabris-decorators";
import LoginService from "./helpers/CodLoginService";

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
  new MainPage()
    .on("appear", () => {
      if (config.SUPPORTS_FEEDBACK && resolve(LoginService).isLoggedIn()) {
        new ProfileAction().appendTo(pageNavigation);
      }
    })
    .on("disappear", () => pageNavigation.find("#profileAction").dispose())
    .appendTo(pageNavigation);
}

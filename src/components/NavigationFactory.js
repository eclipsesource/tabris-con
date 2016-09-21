import Schedule from "../pages/Schedule";
import Tracks from "../pages/Tracks";
import Map from "../pages/Map";
import Conference from "../pages/Conference";
import About from "../pages/About";
import * as TabFolderNavigation from "./TabFolderNavigation";
import * as DrawerNavigation from "./DrawerNavigation";
import * as ViewDataProviderFactory from "../ViewDataProviderFactory";

let navigation = {
  Android: DrawerNavigation,
  windows: DrawerNavigation,
  iOS: TabFolderNavigation
};

export function create(config, remoteService, loginService, feedbackService) {
  navigation[device.platform]
    .createWith(
      [Schedule, Tracks, Map, config.CONFERENCE_PAGE ? Conference : null, About].filter(val => !!val),
      ViewDataProviderFactory.create(config, remoteService, loginService, feedbackService),
      loginService,
      feedbackService
    )
    .open("#tracks");
}

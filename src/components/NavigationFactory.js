import Schedule from "../pages/Schedule";
import Tracks from "../pages/Tracks";
import Map from "../pages/Map";
import About from "../pages/About";
import * as TabFolderNavigation from "./TabFolderNavigation";
import * as DrawerNavigation from "./DrawerNavigation";
import * as ViewDataProviderFactory from "../ViewDataProviderFactory";

let navigation = {
  Android: DrawerNavigation,
  UWP: DrawerNavigation,
  iOS: TabFolderNavigation
};

export function create(config) {
  navigation[device.platform]
    .createWith([Schedule, Tracks, Map, About], ViewDataProviderFactory.create(config))
    .open("#tracks");
}

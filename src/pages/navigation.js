import {NavigationView, ui} from "tabris";
import colors from "../resources/colors";
import {select} from "../helpers/platform";
import config from "../configs/config";

export let pageNavigation = new NavigationView({
  left: 0, top: 0, right: 0, bottom: 0,
  actionColor: select({
    android: colors.ANDROID_ACTION_AREA_FOREGROUND_COLOR,
    ios: colors.IOS_ACTION_AREA_FOREGROUND_COLOR
  }),
  toolbarColor: select({
    android: colors.ANDROID_ACTION_AREA_BACKGROUND_COLOR,
    default: "initial"
  }),
  actionTextColor: select({
    android: colors.ANDROID_ACTION_AREA_FOREGROUND_COLOR,
    ios: colors.IOS_ACTION_AREA_FOREGROUND_COLOR
  }),
  titleTextColor: select({
    android: colors.ANDROID_ACTION_AREA_FOREGROUND_COLOR,
    ios: colors.IOS_ACTION_AREA_FOREGROUND_COLOR
  })
}).appendTo(ui.contentView);

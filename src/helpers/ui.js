import {ui} from "tabris";
import {select} from "./platform";
import colors from "../resources/colors";
import config from "../configs/config";

export function initialize() {

  ui.set({
    background: select({
      android: colors.ANDROID_ACTION_AREA_BACKGROUND_COLOR,
      windows: colors.WINDOWS_ACTION_AREA_BACKGROUND_COLOR,
      default: "initial"
    }),
    win_theme: config.WINDOWS_UI_THEME
  });

  ui.statusBar.background = select({
    android: colors.STATUS_BAR_BACKGROUND,
    default: "initial"
  });

}

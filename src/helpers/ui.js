import {ui} from "tabris";
import {select} from "./platform";
import colors from "../resources/colors";
import config from "../configs/config";

export function initialize() {

  ui.set({
    background: select({
      android: colors.ANDROID_ACTION_AREA_BACKGROUND_COLOR,
      default: "initial"
    })
  });

  ui.statusBar.background = select({
    android: colors.STATUS_BAR_BACKGROUND,
    default: "initial"
  });

}

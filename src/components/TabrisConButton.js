import sizes from "../resources/sizes";
import colors from "../resources/colors";
import fontToString from "../helpers/fontToString";
import {select} from "../helpers/platform";
import {Button} from "tabris";

export default class extends Button {

  constructor(configuration) {
    super(
      Object.assign({}, configuration, {
        font: fontToString({size: sizes.FONT_LARGE, weight: "bold"}),
        textColor: select({ios: colors.ACCENTED_TEXT_COLOR, default: "white"}),
        background: select({ios: "transparent", default: colors.BACKGROUND_COLOR})
      })
    );
    if (device.platform === "Android" && this.text) {
      this.text = this.text.toUpperCase();
    }
    this._updateAndroidBackground(this.enabled);
  }

  set enabled(enabled) {
    this._enabled = enabled;
    this._updateAndroidBackground(enabled);
  }

  get enabled() {
    return this._enabled;
  }

  _updateAndroidBackground(enabled) {
    if (device.platform === "Android") {
      this.background = enabled ? colors.BUTTON_COLOR : colors.ANDROID_BUTTON_DISABLED_BACKGROUND;
    }
  }

}

import sizes from "../resources/sizes";
import colors from "../resources/colors";
import applyPlatformStyle from "../helpers/applyPlatformStyle";
import fontToString from "../helpers/fontToString";
import {Button} from "tabris";

export default class extends Button {

  constructor(configuration) {
    super(
      Object.assign({}, configuration, {
        class: "button",
        font: fontToString({size: sizes.FONT_LARGE, weight: "bold"})
      })
    );
    if (device.platform === "Android" && this.text) {
      this.text = this.text.toUpperCase();
    }
    applyPlatformStyle(this);
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

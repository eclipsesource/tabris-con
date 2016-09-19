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
    this.on("change:enabled", updateAndroidButtonBackground);
    if (device.platform === "Android" && this.get("text")) {
      this.set("text", this.get("text").toUpperCase());
    }
    applyPlatformStyle(this);
    updateAndroidButtonBackground(this, this.get("enabled"));
  }
}

function updateAndroidButtonBackground(button, enabled) {
  if (device.platform === "Android") {
    button.set("background", enabled ? colors.BUTTON_COLOR : colors.ANDROID_BUTTON_DISABLED_BACKGROUND);
  }
}

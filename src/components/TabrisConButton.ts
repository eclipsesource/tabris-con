import { Button, ButtonProperties, device } from "tabris";
import fontToString from "../helpers/fontToString";
import colors from "../resources/colors";
import sizes from "../resources/sizes";
import { select } from "../helpers/platform";

export default class TabrisConButton extends Button {

  public jsxProperties: JSX.ButtonProperties;

  private _enabled: boolean = true;

  constructor(configuration: ButtonProperties) {
    super({
      font: fontToString({ size: sizes.FONT_LARGE, weight: "bold" }),
      textColor: select({ ios: colors.ACCENTED_TEXT_COLOR, default: "white" }),
      background: select({ ios: "transparent", default: colors.BACKGROUND_COLOR }),
      ...configuration
    });
    this.updateAndroidBackground(this.enabled);
  }

  set enabled(enabled: boolean) {
    this._enabled = enabled;
    this.updateAndroidBackground(enabled);
  }

  get enabled() {
    return this._enabled;
  }

  set text(text: string) {
    super.text = device.platform === "Android" ? text.toUpperCase() : text;
  }

  get text() {
    return super.text;
  }

  private updateAndroidBackground(enabled: boolean) {
    if (device.platform === "Android") {
      this.background = enabled ? colors.BUTTON_COLOR : colors.ANDROID_BUTTON_DISABLED_BACKGROUND;
    }
  }

}

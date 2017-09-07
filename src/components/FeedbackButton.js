import sizes from "../resources/sizes";
import colors from "../resources/colors";
import fontToString from "../helpers/fontToString";
import {TextView} from "tabris";

export default class extends TextView {
  constructor(configuration) {
    super(
      Object.assign({}, configuration, {
        textColor: colors.ACTION_COLOR,
        highlightOnTouch: true,
        font: fontToString({size: sizes.FONT_LARGE, weight: "bold"})
      })
    );
    if (device.platform === "Android" && this.text) {
      this.text = this.text.toUpperCase();
    }
    this.on("tap", () => this.trigger("select"));
  }
}

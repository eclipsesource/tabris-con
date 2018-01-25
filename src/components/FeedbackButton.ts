import { TextView, TextViewProperties, device } from "tabris";
import fontToString from "../helpers/fontToString";
import colors from "../resources/colors";

export default class FeedbackButton extends TextView {

  public jsxProperties: JSX.TextViewProperties & { onSelect?: () => void };

  constructor(configuration: TextViewProperties) {
    super(
      Object.assign({
        textColor: colors.ACTION_COLOR,
        highlightOnTouch: true,
        font: fontToString({ size: 16, weight: "bold" })
      }, configuration)
    );
    if (device.platform === "Android" && this.text) {
      this.text = this.text.toUpperCase();
    }
    this.on("tap", () => this.trigger("select"));
  }

}

import sizes from "../resources/sizes";
import applyPlatformStyle from "../helpers/applyPlatformStyle";
import {Composite} from "tabris";

export default class extends Composite {
  constructor() {
    super({class: "sessionPageHeaderTrackIndicator"});
    applyPlatformStyle(this);

    if (device.platform !== "iOS") {
      var square = new Composite({
        centerX: 0, top: sizes.MARGIN_XXSMALL,
        width: sizes.TRACK_SQUARE_SIZE,
        height: sizes.TRACK_SQUARE_SIZE
      }).appendTo(this);
    }

    this.on("change:color", (widget, color) => {
      let coloredWidget = device.platform === "iOS" ? this : square;
      coloredWidget.set("background", color);
    });
  }
}

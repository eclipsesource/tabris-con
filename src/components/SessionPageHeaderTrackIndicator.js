import sizes from "../resources/sizes";
import {Composite} from "tabris";

export default class extends Composite {
  constructor() {
    let iOSConfig = {left: sizes.MARGIN_LARGE, top: sizes.MARGIN, bottom: sizes.MARGIN, width: 2};
    let config = {
      left: 0,
      right: "#sessionPageTitleTextView",
      top: ["#sessionPageNavigationControls", sizes.MARGIN + 2]
    };

    super(device.platform === "iOS" ? iOSConfig : config);

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

import sizes from "../resources/sizes";
import {Composite} from "tabris";

export default class extends Composite {

  constructor(properties) {
    super(properties);

    if (device.platform !== "iOS") {
      this.square = new Composite({
        centerX: 0, top: sizes.MARGIN_XXSMALL,
        width: sizes.TRACK_SQUARE_SIZE,
        height: sizes.TRACK_SQUARE_SIZE
      }).appendTo(this);
    }
  }

  set color(color) {
    this._color = color;
    let coloredWidget = device.platform === "iOS" ? this : this.square;
    coloredWidget.background = color;
  }

  get color() {
    return this._color;
  }

}

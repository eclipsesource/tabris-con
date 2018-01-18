import { Composite, device, CompositeProperties } from "tabris";
import { getById } from "tabris-decorators";
import sizes from "../resources/sizes";

export default class SessionPageHeaderTrackIndicator extends Composite {

  public jsxProperties: JSX.CompositeProperties;

  @getById private square: Composite;

  private _color: string = null;

  constructor(properties: CompositeProperties) {
    super(properties);
    if (device.platform !== "iOS") {
      this.append(
        <composite
          id="square"
          centerX={0} top={sizes.MARGIN_XXSMALL}
          width={sizes.TRACK_SQUARE_SIZE}
          height={sizes.TRACK_SQUARE_SIZE} />
      );
    }
  }

  set color(color: string) {
    this._color = color;
    let coloredWidget = device.platform === "iOS" ? this : this.square;
    coloredWidget.background = color;
  }

  get color() {
    return this._color;
  }

}

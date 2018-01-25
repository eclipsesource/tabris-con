import { Composite, device, CompositeProperties } from "tabris";

export default class SessionPageHeaderTrackIndicator extends Composite {

  public jsxProperties: JSX.CompositeProperties;

  private _color: string = null;

  constructor(properties: CompositeProperties) {
    super(properties);
    if (device.platform !== "iOS") {
      this.append(
        <composite
          id="square"
          centerX={0} top={1} width={18} height={18} />
      );
    }
  }

  set color(color: string) {
    this._color = color;
    let coloredWidget = device.platform === "iOS" ? this : this.find("#square").first();
    coloredWidget.background = color;
  }

  get color() {
    return this._color;
  }

}

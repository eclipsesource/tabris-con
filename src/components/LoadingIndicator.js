import {Composite, ActivityIndicator} from "tabris";

export default class LoadingIndicator extends Composite {
  constructor(options) {
    super({
      left: 0, top: 0, right: 0, bottom: 0,
      id: "loadingIndicator"
    });
    new Composite({
      left: 0, top: 0, right: 0, bottom: 0,
      background: options && options.shade ? "white" : "transparent"
    }).on("tap", () => {}).appendTo(this);
    new ActivityIndicator({centerX: 0, centerY: 0}).appendTo(this);
  }
}

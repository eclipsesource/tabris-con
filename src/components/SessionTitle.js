import sizes from "../resources/sizes";
import fontToString from "../helpers/fontToString";
import {Composite, TextView} from "tabris";

export default class extends Composite {
  constructor(configuration) {
    super(
      Object.assign({}, configuration, {
        left: 0, top: 0, right: 0, height: sizes.SESSION_CATEGORY_TITLE_CELL_HEIGHT
      })
    );
    let titleTextView = new TextView({
      class: "titleTextView",
      left: sizes.MARGIN_LARGE, centerY: 0, right: ["#moreTextView", sizes.MARGIN],
      maxLines: 1,
      font: fontToString({weight: "bold", size: sizes.FONT_XLARGE}),
      textColor: configuration ? configuration.textColor || "initial" : "initial"
    }).appendTo(this);
    this.on("change:text", (widget, text) => titleTextView.set("text", text));
  }
}

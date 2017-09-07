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
  }

  _getLabel() {
    return (this._label = this._label || new TextView({
      class: "titleTextView",
      left: sizes.MARGIN_LARGE, centerY: 0, right: ["#moreTextView", sizes.MARGIN],
      maxLines: 1,
      font: fontToString({weight: "bold", size: sizes.FONT_XLARGE})
    }).appendTo(this));
  }

  set text(text) {
    this._text = text;
    this._getLabel().text = text;
  }

  get text() {
    return this._text;
  }

  set textColor(textColor) {
    this._textColor = textColor;
    this._getLabel().textColor = textColor;
  }

  get textColor() {
    return this._textColor;
  }

}

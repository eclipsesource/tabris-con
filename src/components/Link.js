/*jshint nonew: false*/
import colors from "../resources/colors";
import {Composite, TextView} from "tabris";
import {pageNavigation} from "../pages/navigation";

export default class extends Composite {
  constructor(configuration) {
    super(Object.assign({}, {highlightOnTouch: true}, configuration));
    this.on("tap", () => {
      if (this.url) {
        if (!window.open) {
          console.error("cordova-plugin-inappbrowser is not available in this Tabris.js client.");
          return;
        }
        window.open(this.url, "_system");
      } else if (this.page) {
        new (this.page)().appendTo(pageNavigation);
      }
    });
  }

  _getLabel() {
    return (this._label = this._label || new TextView({
      left: 0, top: 0, right: 0,
      textColor: colors.LINK_COLOR
    }).appendTo(this));
  }

  set url(url) {
    this._url = url;
  }

  get url() {
    return this._url;
  }

  set page(page) {
    this._page = page;
  }

  get page() {
    return this._page;
  }

  set text(text) {
    this._text = text;
    this._getLabel().text = text;
  }

  get text() {
    return this._text;
  }

  set font(font) {
    this._font = font;
    this._getLabel().font = font;
  }

  get font() {
    return this._font;
  }

  set alignment(alignment) {
    this._alignment = alignment;
    this._getLabel().alignment = alignment;
  }

  get alignment() {
    return this._alignment;
  }

  set height(height) {
    this._height = height;
    this._getLabel().height = height;
  }

  get height() {
    return this._height;
  }

}

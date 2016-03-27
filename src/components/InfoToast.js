import colors from "../resources/colors";
import sizes from "../resources/sizes";
import fontToString from "../helpers/fontToString";
import {Composite, TextView} from "tabris";

export default class extends Composite {
  constructor() {
    super({
      background: colors.INFO_TOAST_BACKGROUND_COLOR,
      id: "infoToast",
      left: 0, bottom: 0, right: 0, height: sizes.INFO_TOAST_HEIGHT,
      transform: {translationY: sizes.INFO_TOAST_HEIGHT}
    });

    this.POP_ANIMATION_DURATION = 500;
    this.POP_HIDE_DELAY = 5000;

    new TextView({
      id: "infoToastTextView",
      textColor: colors.LIGHT_PRIMARY_TEXT_COLOR,
      font: fontToString({size: sizes.FONT_MEDIUM}),
      markupEnabled: true,
      left: sizes.MARGIN_LARGE, right: ["#actionTextView", sizes.MARGIN], centerY: 0
    }).appendTo(this);

    new TextView({
      id: "infoToastActionTextView",
      highlightOnTouch: true,
      textColor: colors.ACTION_COLOR,
      font: fontToString({size: sizes.FONT_MEDIUM}),
      right: sizes.MARGIN_LARGE, centerY: 0, height: sizes.INFO_TOAST_HEIGHT
    }).on("tap", () => this.trigger("actionTap", this))
      .appendTo(this);
  }

  show(toastObject) {
    let textView = this.children("#infoToastTextView");
    let actionTextView = this.children("#infoToastActionTextView");
    this.set({toastType: toastObject.type});
    textView.set("text", toastObject.messageText);
    actionTextView.set("text", toastObject.actionText);
    if (this.get("transform").translationY > 0) {
      this.animate({transform: {translationY: 0}}, {duration: this.POP_ANIMATION_DURATION, easing: "ease-out"});
    }
    if (this._timeout) {
      clearTimeout(this._timeout);
    }
    this._timeout = setTimeout(() => this._hideInfoToast(), this.POP_HIDE_DELAY);
  }

  _hideInfoToast() {
    if (!this.isDisposed()) {
      this.animate({
        transform: {translationY: this.get("height")}
      }, {
        duration: this.POP_ANIMATION_DURATION,
        easing: "ease-out"
      });
    }
  }
}

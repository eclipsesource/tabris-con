import colors from "../resources/colors";
import sizes from "../resources/sizes";
import fontToString from "../helpers/fontToString";
import {pageNavigation} from "../pages/navigation";
import {Composite, TextView} from "tabris";

export default class InfoToast extends Composite {
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
    }).on("tap", () => this.trigger("actionTap", {target: this}))
      .appendTo(this);
  }

  set toastType(type) {
    this._toastType = type;
  }

  get toastType() {
    return this._toastType;
  }

  static show(toastObject) {
    let toast = this._create();
    let textView = toast.children("#infoToastTextView").first();
    let actionTextView = toast.children("#infoToastActionTextView").first();
    toast.toastType = toastObject.type;
    textView.text = toastObject.messageText;
    actionTextView.set({
      visible: !!toastObject.actionText,
      text: toastObject.actionText
    });
    if (toast.transform.translationY > 0) {
      toast.animate({transform: {translationY: 0}}, {duration: toast.POP_ANIMATION_DURATION, easing: "ease-out"});
    }
    if (toast._timeout) {
      clearTimeout(toast._timeout);
    }
    toast._timeout = setTimeout(() => toast._hideInfoToast(), toast.POP_HIDE_DELAY);
    return toast;
  }

  static _create() {
    let topPage = pageNavigation.pages().last();
    if (!topPage.children("#infoToast").length) {
      return new InfoToast().appendTo(topPage);
    } else {
      return topPage.children("#infoToast").first();
    }
  }

  _hideInfoToast() {
    if (!this.isDisposed()) {
      this.animate({
        transform: {translationY: this.height}
      }, {
        duration: this.POP_ANIMATION_DURATION,
        easing: "ease-out"
      });
    }
  }
}

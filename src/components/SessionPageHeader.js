import sizes from "../resources/sizes";
import colors from "../resources/colors";
import getImage from "../helpers/getImage";
import {select} from "../helpers/platform";
import SessionPageHeaderTrackIndicator from "./SessionPageHeaderTrackIndicator";
import fontToString from "../helpers/fontToString";
import {Composite, ImageView, TextView} from "tabris";

class AttendanceButton extends ImageView {

  constructor(properties) {
    super(Object.assign({
      image: getImage.common("plus"),
      highlightOnTouch: true
    }, properties));
    this.on("tap", () => this.trigger("select", {wasChecked: this.checked}));
  }

  set checked(checked) {
    this._checked = checked;
    this.image = checked ? getImage.common("check") : getImage.common("plus");
  }

  get checked() {
    return this._checked;
  }

}

export default class extends Composite {

  constructor(properties) {
    super(Object.assign({
      id: "sessionPageHeader",
      background: select({android: colors.BACKGROUND_COLOR, default: "white"})
    }, properties));

    let navigationControls = new Composite({
      id: "sessionPageNavigationControls",
      left: 0, top: 0, right: 0, height: select({android: sizes.SESSION_HEADER_ICON, default: 0})
    }).appendTo(this);

    this._trackIndicator = new SessionPageHeaderTrackIndicator({
      left: select({ios: sizes.MARGIN_LARGE, default: 0}),
      right: select({ios: null, default: "#sessionPageTitleTextView"}),
      bottom: select({ios: sizes.MARGIN, default: null}),
      width: select({ios: 2, default: null}),
      top: sizes.SESSION_PAGE_TRACK_INDICATOR_TOP
    }).appendTo(this);

    new ImageView({
      left: 0, top: 0, width: sizes.SESSION_HEADER_ICON,
      image: getImage.forDevicePlatform("back_arrow"),
      highlightOnTouch: true,
      height: select({
        android: sizes.SESSION_HEADER_ICON,
        default: 0
      })
    }).on("tap", () => this.trigger("backButtonTap")).appendTo(navigationControls);

    this._attendanceButton = new AttendanceButton({
      right: 0, top: 0, width: sizes.SESSION_HEADER_ICON,
      height: select({
        android: sizes.SESSION_HEADER_ICON,
        default: 0
      })
    }).on("select", ({wasChecked}) => this.trigger("attendanceButtonTap", {wasChecked, target: this}))
      .appendTo(navigationControls);

    this._titleTextView = new TextView({
      id: "sessionPageTitleTextView",
      right: sizes.MARGIN_LARGE,
      left: select({
        ios: sizes.MARGIN_XLARGE,
        default: sizes.LEFT_CONTENT_MARGIN
      }),
      top: select({
        android: [navigationControls, sizes.MARGIN],
        default: [navigationControls, sizes.MARGIN_LARGE]
      }),
      font: fontToString({weight: "bold", size: sizes.FONT_XLARGE}),
      textColor: select({
        android: colors.ANDROID_ACTION_AREA_FOREGROUND_COLOR,
        default: colors.DARK_PRIMARY_TEXT_COLOR
      })
    }).appendTo(this);

    this._summaryTextView = new TextView({
      right: sizes.MARGIN_LARGE, top: "prev()",
      left: select({
        ios: sizes.MARGIN_XLARGE,
        default: sizes.LEFT_CONTENT_MARGIN
      }),
      bottom: sizes.MARGIN_LARGE,
      font: select({
        android: fontToString({size: sizes.FONT_LARGE}),
        default: fontToString({size: sizes.FONT_MEDIUM})
      }),
      textColor: select({
        android: colors.ANDROID_ACTION_AREA_FOREGROUND_COLOR,
        default: colors.DARK_SECONDARY_TEXT_COLOR
      })
    }).appendTo(this);

  }

  set titleText(titleText) {
    this._titleTextView.text = titleText;
  }

  get titleText() {
    return this._titleTextView.text;
  }

  set summaryText(summaryText) {
    this._summaryTextView.text = summaryText;
  }

  get summaryText() {
    return this._summaryTextView.text;
  }

  set attending(attending) {
    this._attendanceButton.checked = attending;
  }

  get attending() {
    return this._attendanceButton.checked;
  }

  set trackIndicatorColor(color) {
    this._trackIndicator.color = color;
  }

  get trackIndicatorColor() {
    return this._trackIndicator.color;
  }

}

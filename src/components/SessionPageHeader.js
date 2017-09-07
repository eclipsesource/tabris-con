import sizes from "../resources/sizes";
import getImage from "../helpers/getImage";
import SessionPageHeaderTrackIndicator from "./SessionPageHeaderTrackIndicator";
import applyPlatformStyle from "../helpers/applyPlatformStyle";
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

  constructor() {
    super({
      left: 0, right: 0,
      id: "sessionPageHeader"
    });

    applyPlatformStyle(this);

    let navigationControls = new Composite({
      id: "sessionPageNavigationControls",
      left: 0, top: 0, right: 0
    }).appendTo(this);

    applyPlatformStyle(navigationControls);

    this._trackIndicator = new SessionPageHeaderTrackIndicator().appendTo(this);

    let backButton = new ImageView({
      id: "sessionPageNavigationControlsBackButton",
      left: 0, top: 0, width: sizes.SESSION_HEADER_ICON,
      image: getImage.forDevicePlatform("back_arrow"),
      highlightOnTouch: true
    }).on("tap", () => this.trigger("backButtonTap")).appendTo(navigationControls);
    applyPlatformStyle(backButton);

    this._attendanceButton = new AttendanceButton({
      id: "sessionPageNavigationControlsAttendanceButton",
      right: 0, top: 0, width: sizes.SESSION_HEADER_ICON
    }).on("select", ({wasChecked}) => this.trigger("attendanceButtonTap", {wasChecked, target: this}))
      .appendTo(navigationControls);

    applyPlatformStyle(this._attendanceButton);

    this._titleTextView = new TextView({
      id: "sessionPageTitleTextView", right: sizes.MARGIN_LARGE
    }).appendTo(this);

    applyPlatformStyle(this._titleTextView);

    this._summaryTextView = new TextView({
      id: "sessionPageSummaryTextView",
      right: sizes.MARGIN_LARGE, top: "prev()"
    }).appendTo(this);

    applyPlatformStyle(this._summaryTextView);
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

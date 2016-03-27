import sizes from "../resources/sizes";
import getImage from "../helpers/getImage";
import SessionPageHeaderTrackIndicator from "./SessionPageHeaderTrackIndicator";
import applyPlatformStyle from "../helpers/applyPlatformStyle";
import {Composite, ImageView, TextView} from "tabris";

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

    let trackIndicator = new SessionPageHeaderTrackIndicator().appendTo(this);

    let backButton = new ImageView({
      id: "sessionPageNavigationControlsBackButton",
      left: 0, top: 0, width: sizes.SESSION_HEADER_ICON,
      image: getImage.forDevicePlatform("back_arrow"),
      highlightOnTouch: true
    }).on("tap", () => this.trigger("backButtonTap")).appendTo(navigationControls);
    applyPlatformStyle(backButton);

    let attendanceButton = new ImageView({
      id: "sessionPageNavigationControlsAttendanceButton",
      right: 0, top: 0, width: sizes.SESSION_HEADER_ICON,
      image: getImage.common("plus"),
      highlightOnTouch: true
    }).on("tap", widget => this.trigger("attendanceButtonTap", this, widget.get("checked")))
      .on("change:checked",
        (widget, checked) =>
          widget.set("image", checked ? getImage.common("check") : getImage.common("plus")))
      .appendTo(navigationControls);

    applyPlatformStyle(attendanceButton);

    let titleTextView = new TextView({
      id: "sessionPageTitleTextView", right: sizes.MARGIN_LARGE
    }).appendTo(this);

    applyPlatformStyle(titleTextView);

    let summaryTextView = new TextView({
      id: "sessionPageSummaryTextView",
      right: sizes.MARGIN_LARGE, top: "prev()",
      textColor: "white"
    }).appendTo(this);

    applyPlatformStyle(summaryTextView);

    this
      .on("change:titleText", (widget, text) => titleTextView.set("text", text))
      .on("change:summaryText", (widget, text) => summaryTextView.set("text", text))
      .on("change:attending", (widget, attending) => attendanceButton.set("checked", attending))
      .on("change:trackIndicatorColor", (widget, trackIndicatorColor) =>
        trackIndicator.set("color", trackIndicatorColor));
  }
}

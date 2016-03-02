var sizes = require("../resources/sizes");
var getImage = require("../helpers/getImage");
var SessionPageHeaderTrackIndicator = require("./SessionPageHeaderTrackIndicator");
var applyPlatformStyle = require("../helpers/applyPlatformStyle");

exports.create = function() {
  var sessionPageHeader = tabris.create("Composite", {
    left: 0, right: 0,
    id: "sessionPageHeader"
  });
  applyPlatformStyle(sessionPageHeader);

  var navigationControls = tabris.create("Composite", {
    id: "sessionPageNavigationControls",
    left: 0, top: 0, right: 0
  }).appendTo(sessionPageHeader);
  applyPlatformStyle(navigationControls);

  var trackIndicator = SessionPageHeaderTrackIndicator.create().appendTo(sessionPageHeader);

  var backButton = tabris.create("ImageView", {
    id: "sessionPageNavigationControlsBackButton",
    left: 0, top: 0, width: sizes.SESSION_HEADER_ICON,
    image: getImage.forDevicePlatform("back_arrow"),
    highlightOnTouch: true
  }).on("tap", function() {
    sessionPageHeader.trigger("backButtonTap");
  }).appendTo(navigationControls);
  applyPlatformStyle(backButton);

  var attendanceButton = tabris.create("ImageView", {
    id: "sessionPageNavigationControlsAttendanceButton",
    right: 0, top: 0, width: sizes.SESSION_HEADER_ICON,
    image: getImage.common("plus"),
    highlightOnTouch: true
  }).on("tap", function() {
    sessionPageHeader.trigger("attendanceButtonTap", sessionPageHeader, this.get("checked"));
  }).on("change:checked", function(widget, checked) {
    this.set("image", checked ? getImage.common("check") : getImage.common("plus"));
  }).appendTo(navigationControls);
  applyPlatformStyle(attendanceButton);

  var titleTextView = tabris.create("TextView", {
    id: "sessionPageTitleTextView", right: sizes.MARGIN_LARGE
  }).appendTo(sessionPageHeader);
  applyPlatformStyle(titleTextView);

  var summaryTextView = tabris.create("TextView", {
    id: "sessionPageSummaryTextView",
    right: sizes.MARGIN_LARGE, top: "prev()",
    textColor: "white"
  }).appendTo(sessionPageHeader);
  applyPlatformStyle(summaryTextView);

  sessionPageHeader
    .on("change:titleText", function(widget, text) {
      titleTextView.set("text", text);
    })
    .on("change:summaryText", function(widget, text) {
      summaryTextView.set("text", text);
    })
    .on("change:attending", function(widget, attending) {
      attendanceButton.set("checked", attending);
    })
    .on("change:trackIndicatorColor", function(widget, trackIndicatorColor) {
      trackIndicator.set("color", trackIndicatorColor);
    });

  return sessionPageHeader;
};

var sizes = require("../../resources/sizes");
var getImage = require("../getImage");
var applyPlatformStyle = require("./applyPlatformStyle");

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

  var backButton = tabris.create("ImageView", {
    id: "sessionPageNavigationControlsBackButton",
    left: 0, top: 0, width: sizes.SESSION_HEADER_ICON,
    image: getImage("back_arrow"),
    highlightOnTouch: true
  }).on("tap", function() {
    sessionPageHeader.trigger("backButtonTap");
  }).appendTo(navigationControls);
  applyPlatformStyle(backButton);

  var attendanceButton = tabris.create("ImageView", {
    id: "sessionPageNavigationControlsAttendanceButton",
    right: 0, top: 0, width: sizes.SESSION_HEADER_ICON,
    image: getImage("plus"),
    highlightOnTouch: true
  }).on("tap", function() {
    sessionPageHeader.trigger("attendanceButtonTap", sessionPageHeader, this.get("checked"));
  }).on("change:checked", function(widget, checked) {
    this.set("image", checked ? getImage("check") : getImage("plus"));
  }).appendTo(navigationControls);
  applyPlatformStyle(attendanceButton);

  var titleTextView = tabris.create("TextView", {
    id: "sessionPageTitleTextView",
    top: ["#sessionPageNavigationControls", sizes.MARGIN], right: sizes.MARGIN_BIG
  }).appendTo(sessionPageHeader);
  applyPlatformStyle(titleTextView);

  var summaryTextView = tabris.create("TextView", {
    id: "sessionPageSummaryTextView",
    right: sizes.MARGIN_BIG, top: "prev()",
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
    });

  return sessionPageHeader;
};

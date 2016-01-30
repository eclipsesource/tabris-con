var sizes = require("../../resources/sizes");
var colors = require("../../resources/colors");
var getImage = require("../getImage");
var fontToString = require("../fontToString");
var persistedStorage = require("../data/persistedStorage");

exports.EVENTS = {
  BACK_BUTTON_TAP: "backButtonTap",
  ADD_SESSION_BUTTON_TAP: "addSessionButtonTap"
};

exports.create = function() {
  var sessionPageHeader = tabris.create("Composite", {
    left: 0, right: 0,
    id: "sessionPageHeader",
    background: colors.BACKGROUND_COLOR
  }).on("change:titleText", function(widget, text) {
    titleTextView.set("text", text);
  }).on("change:summaryText", function(widget, text) {
    summaryTextView.set("text", text);
  });

  var backButton = tabris.create("ImageView", {
    left: 0, top: 0, width: sizes.SESSION_HEADER_ICON, height: sizes.SESSION_HEADER_ICON,
    image: getImage("back_arrow"),
    highlightOnTouch: true
  }).on("tap", function() {
    sessionPageHeader.trigger(exports.EVENTS.BACK_BUTTON_TAP);
  }).appendTo(sessionPageHeader);

  tabris.create("ImageView", {
    right: 0, top: 0, width: sizes.SESSION_HEADER_ICON, height: sizes.SESSION_HEADER_ICON,
    image: getImage("plus"),
    highlightOnTouch: true,
    inList: false // TODO: get from app data
  }).on("tap", function() {
    if (sessionPageHeader.get("sessionId")) {
      var chosenSessionId = sessionPageHeader.get("sessionId");
      if (this.get("inList")) {
        persistedStorage.removeChosenSessionId(chosenSessionId);
      } else {
        persistedStorage.addChosenSessionId(chosenSessionId);
      }
      this.set("inList", !this.get("inList"));
      this.set("image", this.get("inList") ? getImage("check") : getImage("plus"));
      sessionPageHeader.trigger(exports.EVENTS.ADD_SESSION_BUTTON_TAP, sessionPageHeader, this.get("inList"));
    }
  }).appendTo(sessionPageHeader);

  var titleTextView = tabris.create("TextView", {
    left: sizes.LEFT_CONTENT_MARGIN, top: [backButton, sizes.MARGIN], right: sizes.MARGIN_BIG,
    font: fontToString({weight: "bold", size: sizes.FONT_XLARGE}),
    textColor: "white"
  }).appendTo(sessionPageHeader);

  var summaryTextView = tabris.create("TextView", {
    left: sizes.LEFT_CONTENT_MARGIN, bottom: sizes.MARGIN_BIG, right: sizes.MARGIN_BIG, top: "prev()",
    font: fontToString({size: sizes.FONT_LARGE}),
    textColor: "white"
  }).appendTo(sessionPageHeader);

  return sessionPageHeader;
};

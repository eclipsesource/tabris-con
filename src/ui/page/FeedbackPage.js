var fontToString = require("../../fontToString");
var sizes = require("../../../resources/sizes");
var Button = require("../Button");
var FeedbackThumbs = require("./FeedbackThumbs");
var codRemoteService = require("../../codRemoteService");
var addProgressTo = require("../addProgressTo");

exports.create = function(adaptedSession) {
  var page = tabris.create("Page", {title: "Feedback", topLevel: false});
  var container = tabris.create("Composite", {
    centerX: 0, centerY: 0, width: sizes.PAGE_CONTAINER_WIDTH
  }).appendTo(page);
  tabris.create("TextView", {
    alignment: "center",
    text: "Did you enjoy this session?",
    font: fontToString({size: sizes.FONT_XXLARGE})
  }).appendTo(container);
  var feedbackThumbs = FeedbackThumbs.create().appendTo(container);
  var commentTextInput = tabris.create("TextInput", {
    message: "Comment...",
    left: 0, right: 0, top: ["prev()", sizes.MARGIN_LARGE]
  }).appendTo(container);
  var button = Button.create({
    right: 0, top: ["prev()", sizes.MARGIN],
    text: "Submit"
  }).appendTo(container);
  addProgressTo(button);
  button.on("select", function() {
    button.set("progress", true);
    codRemoteService.createEvaluation(adaptedSession.nid, commentTextInput.get("text"), feedbackThumbs.get("feedback"))
      .then(function() {page.close();})
      .catch(function() {button.set("progress", false);});
  });
  return page;
};

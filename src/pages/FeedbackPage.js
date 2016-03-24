var fontToString = require("../helpers/fontToString");
var sizes = require("../resources/sizes");
var Button = require("../components/Button");
var FeedbackThumbs = require("../components/FeedbackThumbs");
var codFeedbackService = require("../helpers/codFeedbackService");
var addProgressTo = require("../helpers/addProgressTo");

exports.create = function(adaptedSession) {
  var page = new tabris.Page({title: "Feedback", topLevel: false});
  var container = new tabris.Composite({
    centerX: 0, centerY: 0, width: sizes.PAGE_CONTAINER_WIDTH
  }).appendTo(page);
  new tabris.TextView({
    alignment: "center",
    text: "Did you enjoy this session?",
    font: fontToString({size: sizes.FONT_XXLARGE})
  }).appendTo(container);
  var feedbackThumbs = FeedbackThumbs.create().appendTo(container);
  var commentTextInput = new tabris.TextInput({
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
    codFeedbackService.createEvaluation(
      adaptedSession.id, adaptedSession.nid, commentTextInput.get("text"), feedbackThumbs.get("feedback")
    ).then(function() {
      page.close();
    })
    .catch(function() {button.set("progress", false);});
  });
  return page;
};

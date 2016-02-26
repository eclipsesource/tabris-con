var codRemoteService = require("../../codRemoteService");
var _ = require("lodash");
var FeedbackButton = require("./FeedbackButton");
var FeedbackPage = require("./FeedbackPage");
var addProgressTo = require("../addProgressTo");
var sizes = require("../../../resources/sizes");
var colors = require("../../../resources/colors");
var fontToString = require("../../fontToString");
var applyPlatformStyle = require("../applyPlatformStyle");
var loginService = require("../../loginService");
var codFeedbackService = require("../../codFeedbackService");

exports.create = function(parent, adaptedSession) {
  if (codFeedbackService.canGiveFeedbackForSession(adaptedSession)) {
    create(parent, adaptedSession);
  }
};

function create(parent, adaptedSession) {
  var feedbackWidget = tabris.create("Composite", {
    id: "sessionPageFeedbackWidget",
    top: sizes.MARGIN, right: sizes.MARGIN, height: 36
  }).appendTo(parent);
  addProgressTo(feedbackWidget);
  applyPlatformStyle(feedbackWidget);
  showState(feedbackWidget, adaptedSession);
  feedbackWidget.refresh = function() {
    feedbackWidget.children().dispose();
    showState(feedbackWidget, adaptedSession);
  };
}

function showState(feedbackWidget, adaptedSession) {
  if (loginService.isLoggedIn()) {
    feedbackWidget.set("progress", true);
    showFeedbackState(feedbackWidget, adaptedSession);
  } else {
    createNoticeTextView("Please login to give feedback.").appendTo(feedbackWidget);
  }
}

function showFeedbackState(feedbackWidget, adaptedSession) {
  codRemoteService.evaluations()
    .then(handleSessionValid(feedbackWidget, adaptedSession))
    .catch(handleErrors(feedbackWidget))
    .finally(function() {feedbackWidget.set("progress", false);});
}

function handleSessionValid(feedbackWidget, adaptedSession) {
  return function(evaluations) {
    var evaluationAlreadySubmitted = !!_.find(evaluations, {nid: adaptedSession.nid});
    var widget = evaluationAlreadySubmitted ?
      createNoticeTextView("Feedback for this session was submitted.") : createFeedbackButton(adaptedSession);
    widget.appendTo(feedbackWidget);
  };
}

function handleErrors(feedbackWidget) {
  return function(e) {
    if (e.match && e.match(/Session expired/)) {
      createErrorTextView("Please login again to give feedback.").appendTo(feedbackWidget);
    } else if (e.match && e.match(/Network request failed/)) {
      createErrorTextView("Connect to the Internet to give feedback.").appendTo(feedbackWidget);
    } else {
      createErrorTextView("Something went wrong. Try giving feedback later.").appendTo(feedbackWidget);
    }
  };
}

function createErrorTextView(text) {
  return createInfoTextView(text, colors.ERROR_COLOR);
}

function createNoticeTextView(text) {
  return createInfoTextView(text, colors.ACTION_COLOR);
}

function createInfoTextView(text, color) {
  var infoTextView = tabris.create("TextView", {
    left: 0, centerY: 0, right: sizes.MARGIN,
    maxLines: 2,
    textColor: color,
    font: fontToString({style: "italic", size: sizes.FONT_MEDIUM}),
    text: text
  });
  applyPlatformStyle(infoTextView);
  return infoTextView;
}

function createFeedbackButton(adaptedSession) {
  var feedbackButton = FeedbackButton.create({
    left: 0, centerY: 0,
    text: "Give feedback"
  }).on("select", function() {
    var page = FeedbackPage.create(adaptedSession).open();
    page.on("success", function() {
      var scheduleNavigatable = tabris.ui.find("#schedule").first();
      if (scheduleNavigatable) {
        scheduleNavigatable.initializeItems();
      }
    });
  });
  applyPlatformStyle(feedbackButton);
  return feedbackButton;
}

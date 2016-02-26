var loginService = require("./loginService");
var loginService = require("./loginService");
var config = require("../config");
var _ = require("lodash");

exports.addFeedbackIndicatorState = function(blocksEvaluations) {
  if (loginService.isLoggedIn()) {
    blocksEvaluations.blocks.forEach(function(blockObject) {
      blockObject.blocks.map(function(block) {
        setSessionFeedbackIndicatorState(blocksEvaluations, block);
        return block;
      });
    });
  }
};

exports.canGiveFeedbackForSession = function(session) {
  return validFeedbackWindow(session);
};

function setSessionFeedbackIndicatorState(blocksEvaluations, block) {
  if (block.sessionNid) {
    block.feedbackIndicatorState = getSessionFeedbackIndicatorState(blocksEvaluations.evaluations, block);
  }
}

function getSessionFeedbackIndicatorState(evaluations, block) {
  if (validFeedbackWindow(block)) {
    return _.find(evaluations, {nid: block.sessionNid}) ? "sent" : "pending";
  } else {
    return null;
  }
}

function validFeedbackWindow(session) {
  var currentDate = new Date();
  return currentDate > new Date(session.endTimestamp) && currentDate < new Date(config.FEEDBACK_DEADLINE);
}

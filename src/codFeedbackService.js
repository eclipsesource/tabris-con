var loginService = require("./loginService");
var codRemoteService = require("./codRemoteService");
var attendedSessionService = require("./attendedSessionService");
var loginService = require("./loginService");
var config = require("../config");
var _ = require("lodash");

exports.updateLastSelectedSessionFeedbackIndicator = function(schedule) {
  var lastSelectedSessionId = schedule.get("lastSelectedSessionId");
  if (lastSelectedSessionId && loginService.isLoggedIn()) {
    schedule.set("lastSelectedSessionId", null);
    if (device.platform === "iOS") {
      setTimeout(setIndicatorState, 1000);
    } else {
      schedule.updateSessionWithId(lastSelectedSessionId, "feedbackIndicatorState", "loading");
      setIndicatorState();
    }
  }

  function setIndicatorState() {
    codRemoteService.evaluations()
      .then(function(evaluations) {
        var session = schedule.findSessionById(lastSelectedSessionId);
        var feedbackIndicatorState = getSessionFeedbackIndicatorState(evaluations, session);
        schedule.updateSessionWithId(lastSelectedSessionId, "feedbackIndicatorState", feedbackIndicatorState);
      })
      .catch(function(e) {
        schedule.updateSessionWithId(lastSelectedSessionId, "feedbackIndicatorState", null);
        console.log(e);
        console.log(e.stack);
      });
  }
};

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

var config = require("../../config");
var codRemoteService = require("../codRemoteService");

exports.canGiveFeedbackForSession = function(session) {
  return validFeedbackWindow(session);
};

exports.createEvaluation = function(sessionId) {
  var argumentsArray = Array.prototype.slice.call(arguments);
  argumentsArray.shift();
  return codRemoteService.createEvaluation.apply(this, argumentsArray)
    .then(function() {
      tabris.ui.find("#schedule").set("evaluatedSessionId", sessionId);
    });
};

exports.getSessionsIndicatorState = function(sessions, evaluations) {
  var evaluatedNids = evaluations.map(function(evaluation) {return evaluation.nid;});
  return sessions.map(function(session) {
    if (validFeedbackWindow(session) && evaluatedNids.indexOf(session.sessionNid) > -1) {
      return {id: session.sessionId, state: "sent"};
    }
    if (validFeedbackWindow(session)) {
      return {id: session.sessionId, state: "pending"};
    }
    return {id: session.sessionId, state: null};
  });
};

function validFeedbackWindow(session) {
  var currentDate = new Date();
  return currentDate > new Date(session.endTimestamp) && currentDate < new Date(config.FEEDBACK_DEADLINE);
}

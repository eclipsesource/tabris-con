import config from "../configs/config";
import * as codRemoteService from "../codRemoteService";

export function canGiveFeedbackForSession(session) {
  return config.SUPPORTS_FEEDBACK && validFeedbackWindow(session);
}

export function createEvaluation(sessionId) {
  let argumentsArray = Array.prototype.slice.call(arguments);
  argumentsArray.shift();
  return codRemoteService.createEvaluation.apply(this, argumentsArray)
    .then(() => tabris.ui.find("#schedule").set("evaluatedSessionId", sessionId));
}

export function getSessionsIndicatorState(sessions, evaluations) {
  let evaluatedNids = evaluations.map(evaluation => evaluation.nid);
  return sessions.map(session => {
    if (validFeedbackWindow(session) && evaluatedNids.indexOf(session.sessionNid) > -1) {
      return {id: session.sessionId, state: "sent"};
    }
    if (validFeedbackWindow(session)) {
      return {id: session.sessionId, state: "pending"};
    }
    return {id: session.sessionId, state: null};
  });
}

function validFeedbackWindow(session) {
  let currentDate = new Date();
  return currentDate > new Date(session.endTimestamp) && currentDate < new Date(config.FEEDBACK_DEADLINE);
}

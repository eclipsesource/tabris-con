import config from "../configs/config";

export default class {
  constructor(codRemoteService) {
    this._codRemoteService = codRemoteService;
  }

  canGiveFeedbackForSession(session) {
    return config.SERVICE_URL && config.SUPPORTS_FEEDBACK && this.validFeedbackWindow(session);
  }

  createEvaluation(sessionId) {
    let argumentsArray = Array.prototype.slice.call(arguments);
    argumentsArray.shift();
    return this._codRemoteService.createEvaluation.apply(this, argumentsArray)
      .then(() => tabris.ui.find("#schedule").set("evaluatedSessionId", sessionId));
  }

  getSessionsIndicatorState(sessions, evaluations) {
    let evaluatedNids = evaluations.map(evaluation => evaluation.nid);
    return sessions.map(session => {
      if (this.validFeedbackWindow(session) && evaluatedNids.indexOf(session.sessionNid) > -1) {
        return {id: session.sessionId, state: "sent"};
      }
      if (this.validFeedbackWindow(session)) {
        return {id: session.sessionId, state: "pending"};
      }
      return {id: session.sessionId, state: null};
    });
  }

  validFeedbackWindow(session) {
    let currentDate = new Date();
    return currentDate > new Date(session.endTimestamp) && currentDate < new Date(config.FEEDBACK_DEADLINE);
  }
}

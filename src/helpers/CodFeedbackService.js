import config from "../configs/config";
import ConfigurationDate from "../ConfigurationDate";
import { shared, resolve } from "tabris-decorators";
import CodRemoteService from "../CodRemoteService";

@shared export default class CodFeedbackService {
  constructor() {
    this._codRemoteService = resolve(CodRemoteService);
  }

  canGiveFeedbackForSession(session) {
    return config.SUPPORTS_FEEDBACK && this.validFeedbackWindow(session);
  }

  createEvaluation({id, nid}, comment, rating) {
    return this._codRemoteService.createEvaluation(nid, comment, rating)
      .then(() => tabris.ui.find("#schedule").first().showIndicatorSent(id));
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
    return currentDate > new Date(session.endTimestamp) &&
      currentDate <= new ConfigurationDate(config, config.FEEDBACK_DEADLINE).toJSDate();
  }
}

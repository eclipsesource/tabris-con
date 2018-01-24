import {AlertDialog} from 'tabris';
import sanitizeHtml from "sanitize-html";
import _ from "lodash";
import isFeedbackTime from "./isFeedbackTime";
import timeoutFetch from "./timeoutFetch";
import texts from "./resources/texts";

export default class CodRemoteService {
  constructor(services) {
    this._services = services;
  }

  login(username, password) {
    return this.csrfToken()
      .then(token => this._login(token, username, password))
      .then(jsonify)
      .catch(log)
      .then(response => {
        if (response instanceof Array) {
          let error = sanitizeHtml(response[0], {allowedTags: [], allowedAttributes: []});
          return Promise.reject(error);
        }
        return response;
      })
      .catch(this._logoutIfAlreadyLoggedIn(username, password))
      .catch(alert);
  }

  _login(token, username, password) {
    return timeoutFetch(this._services.LOGIN, {
      method: "post",
      headers: {Accept: "application/json", "Content-Type": "application/json", "X-CSRF-Token": token},
      body: JSON.stringify({username, password})
    });
  }

  logout() {
    return this.csrfToken()
      .then(csrfToken => {
        return timeoutFetch(this._services.LOGOUT, {
          method: "post",
          headers: {
            Accept: "application/json", "Content-Type": "application/json", "X-CSRF-Token": csrfToken
          },
          body: "{}"
        });
      })
      .then(jsonify)
      .catch(log)
      .then(response => {
        if (response instanceof Array && response[0] !== true) {
          return Promise.reject(response[0]);
        }
        return response;
      })
      .catch(resolveExpiredSession)
      .catch(alert);
  }

  csrfToken() {
    return timeoutFetch(this._services.CSRF_TOKEN).then(response => response.text());
  }

  evaluations() {
    return timeoutFetch(this._services.EVALUATIONS)
      .then(jsonify)
      .then(response => {
        if (responseIsAnErrorArray(response)) {
          return Promise.reject(response[0]);
        }
        return Promise.resolve(response);
      })
      .catch(e => {
        if (e.match && e.match(/Access denied/) && isFeedbackTime()) {
          this._loginService.destroySession();
          let error = texts.REMOTE_SERVICE_SESSION_EXPIRED_OR_SERVICE_UNAVAILABLE;
          alert(error);
          return Promise.reject(error);
        }
        return Promise.reject(e);
      })
      .catch(e => {
        if (e.message && e.message.match(/request failed/)) {
          return Promise.reject(e.message);
        }
        return Promise.reject(e);
      });
  }

  createEvaluation(sessionNid, comment, rating) {
    return this.evaluations()
      .then(verifyNotAlreadyExisting(sessionNid))
      .then(() => this.csrfToken())
      .then(this._sendCreateEvaluationRequest(sessionNid, comment, rating))
      .then(jsonify)
      .then(verifyCreateEvaluationResponse)
      .catch(log)
      .catch(alert);
  }

  setLoginService(loginService) {
    this._loginService = loginService;
  }

  _logoutIfAlreadyLoggedIn(username, password) {
    return e => {
      if (e && e.match && e.match(/Already logged in/)) {
        return this.logout().then(() => this.login(username, password));
      }
      return Promise.reject(e);
    };
  }

  _sendCreateEvaluationRequest(sessionNid, comment, rating) {
    return csrfToken => {
      let serviceUrl = this._services.EVALUATIONS;
      return timeoutFetch(serviceUrl, {
        method: "POST",
        headers: {Accept: "application/json", "Content-Type": "application/json", "X-CSRF-Token": csrfToken},
        body: JSON.stringify({session_id: sessionNid, comment: comment, rating: rating})
      });
    };
  }
}

function responseIsAnErrorArray(response) {
  return response instanceof Array && typeof response[0] === "string";
}

function verifyNotAlreadyExisting(sessionNid) {
  return evaluations => {
    let alreadySubmitted = _.some(evaluations, evaluation => sessionNid === evaluation.nid);
    if (alreadySubmitted) {
      return Promise.reject(texts.REMOTE_SERVICE_FEEDBACK_ALREADY_SUBMITTED);
    }
    return Promise.resolve();
  };
}

function verifyCreateEvaluationResponse(response) {
  if (responseIsAnErrorArray(response)) {
    return Promise.reject(response[0]);
  }
  if (!response.nid) {
    return Promise.reject(texts.REMOTE_SERVICE_COULD_NOT_SUBMIT_EVALUATION);
  }
  return Promise.resolve(response);
}

function resolveExpiredSession(e) {
  if (e === "User is not logged in.") {
    return Promise.resolve();
  }
  return Promise.reject(e);
}

function jsonify(response) {
  return response.json();
}

function log(error) {
  console.log(error.message || JSON.stringify(error));
  return Promise.reject(error);
}

function alert(error) {
  new AlertDialog({
    title: texts.DIALOG_ERROR,
    message: error.message || error,
    buttons: {ok: texts.DIALOG_OK}
  }).open();
  return Promise.reject(error);
}

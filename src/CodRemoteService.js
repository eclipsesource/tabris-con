import sanitizeHtml from "sanitize-html";
import _ from "lodash";
import * as alertDialog from "./components/alert";
import isFeedbackTime from "./isFeedbackTime";
import timeoutFetch from "./timeoutFetch";

import URI from "urijs";

export default class {
  constructor(serviceUrl) {
    this._serviceUrl = serviceUrl;
    this._apiUrl = URI(serviceUrl).segment("api").segment("1.0").toString();
  }

  login(username, password) {
    let serviceUrl = URI(this._apiUrl).segment("user").segment("login").toString();
    return this.csrfToken()
      .then(login)
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

    function login(csrfToken) {
      return timeoutFetch(serviceUrl, {
        method: "post",
        headers: {Accept: "application/json", "Content-Type": "application/json", "X-CSRF-Token": csrfToken},
        body: JSON.stringify({
          name: username,
          pass: password
        })
      });
    }
  }

  logout() {
    let serviceUrl = URI(this._apiUrl).segment("user").segment("logout").toString();
    return this.csrfToken()
      .then(csrfToken => {
        return timeoutFetch(serviceUrl, {
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
    let serviceUrl = URI(this._serviceUrl).segment("services").segment("session").segment("token").toString();
    return timeoutFetch(serviceUrl).then(response => response.text());
  }

  evaluations() {
    let serviceUrl = URI(this._apiUrl).segment("eclipsecon_evaluations").toString();
    return timeoutFetch(serviceUrl)
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
          let error = "Session expired or evaluations service unavailable. Please log in again.";
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
      let serviceUrl = URI(this._apiUrl).segment("eclipsecon_evaluations").toString();
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
      return Promise.reject("Evaluation already submitted for this talk.");
    }
    return Promise.resolve();
  };
}

function verifyCreateEvaluationResponse(response) {
  if (responseIsAnErrorArray(response)) {
    return Promise.reject(response[0]);
  }
  if (!response.nid) {
    return Promise.reject("Could not submit evaluation.");
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
  alertDialog.show(error.message || error, "Error", "OK");
  return Promise.reject(error);
}

import sanitizeHtml from "sanitize-html";
import config from "./config";
import _ from "lodash";
import * as loginService from "./helpers/loginService";
import * as alertDialog from "./components/alert";
import isFeedbackTime from "./isFeedbackTime";
import timeoutFetch from "./timeoutFetch";

import URI from "urijs";

let API_URL = URI(config.SERVICE_URL).segment("api").segment("1.0").toString();

export function login(username, password) {
  let serviceUrl = URI(API_URL).segment("user").segment("login").toString();
  return csrfToken()
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
    .catch(logoutIfAlreadyLoggedIn(username, password))
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

export function logout() {
  let serviceUrl = URI(API_URL).segment("user").segment("logout").toString();
  return csrfToken()
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

export function csrfToken() {
  let serviceUrl = URI(config.SERVICE_URL).segment("services").segment("session").segment("token").toString();
  return timeoutFetch(serviceUrl).then(response => response.text());
}

export function evaluations() {
  let serviceUrl = URI(API_URL).segment("eclipsecon_evaluations").toString();
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
        loginService.destroySession();
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

export function createEvaluation(sessionNid, comment, rating) {
  return evaluations()
    .then(verifyNotAlreadyExisting(sessionNid))
    .then(csrfToken)
    .then(sendCreateEvaluationRequest(sessionNid, comment, rating))
    .then(jsonify)
    .then(verifyCreateEvaluationResponse)
    .catch(log)
    .catch(alert);
}

function logoutIfAlreadyLoggedIn(username, password) {
  return e => {
    if (e && e.match && e.match(/Already logged in/)) {
      return logout().then(() => login(username, password));
    }
    return Promise.reject(e);
  };
}

function sendCreateEvaluationRequest(sessionNid, comment, rating) {
  return csrfToken => {
    let serviceUrl = URI(API_URL).segment("eclipsecon_evaluations").toString();
    return timeoutFetch(serviceUrl, {
      method: "POST",
      headers: {Accept: "application/json", "Content-Type": "application/json", "X-CSRF-Token": csrfToken},
      body: JSON.stringify({session_id: sessionNid, comment: comment, rating: rating})
    });
  };
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

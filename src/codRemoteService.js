/* globals fetch: false, Promise: true*/
Promise = require("promise");
require("whatwg-fetch");
var sanitizeHtml = require("sanitize-html");
var config = require("../config");

var URI = require("urijs");

var API_URL = URI(config.VOTING_SERVICE_URL).segment("api").segment("1.0").toString();

exports.login = function(username, password) {
  var serviceUrl = URI(API_URL).segment("user").segment("login").toString();
  return exports.csrfToken()
    .then(login)
    .then(jsonify)
    .catch(log)
    .then(function(response) {
      if (response instanceof Array) {
        var error = sanitizeHtml(response[0], {allowedTags: [], allowedAttributes: []});
        return Promise.reject(error);
      }
      return response;
    })
    .catch(alert);

  function login(csrfToken) {
    return fetch(serviceUrl, {
      method: "post",
      headers: {Accept: "application/json", "Content-Type": "application/json", "X-CSRF-Token": csrfToken},
      body: JSON.stringify({
        name: username,
        pass: password
      })
    });
  }
};

exports.logout = function() {
  var serviceUrl = URI(API_URL).segment("user").segment("logout").toString();
  return exports.csrfToken()
    .then(function(csrfToken) {
      return fetch(serviceUrl, {
        method: "post",
        headers: {
          Accept: "application/json", "Content-Type": "application/json", "X-CSRF-Token": csrfToken
        },
        body: "{}"
      });
    })
    .then(jsonify)
    .catch(log)
    .then(function(response) {
      if (response instanceof Array && response[0] !== true) {
        return Promise.reject(response[0]);
      }
      return response;
    })
    .catch(alert);
};

exports.csrfToken = function() {
  var serviceUrl = URI(config.VOTING_SERVICE_URL).segment("services").segment("session").segment("token").toString();
  return fetch(serviceUrl).then(function(response) {
    return response.text();
  });
};

function jsonify(response) {
  return response.json();
}

function log(error) {
  console.log(error.message || JSON.stringify(error));
  return Promise.reject(error);
}

function alert(error) {
  if (!navigator.notification) {
    console.error("cordova-plugin-dialogs is not available in this Tabris.js client. The error was: " + error);
    return;
  }
  navigator.notification.alert(error.message || error, function() {}, "Error", "OK");
}

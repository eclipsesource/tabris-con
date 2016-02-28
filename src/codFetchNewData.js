/* globals fetch: false, Promise: true*/

var config = require("../config");
Promise = require("promise");
require("whatwg-fetch");
var URI = require("urijs");
var API_URL = URI(config.SERVICE_URL).segment("api").segment("1.0").toString();

module.exports = function() {
  var scheduledSessionsApiUrl = URI(API_URL).segment("eclipsecon_scheduled_sessions").toString();
  return fetch(scheduledSessionsApiUrl, {method: "GET", headers: getFetchHeaders()})
    .then(function(response) {
      if (response.status === 200) {
        localStorage.setItem("codScheduledSessionsETag", response.headers.get("ETag"));
        localStorage.setItem("codScheduledSessionsLastModified", response.headers.get("Last-Modified"));
        return response.json();
      }
      if (response.status === 304) {
        return null;
      }
      throw new CouldNotFetchDataError();
    })
    .then(function(json) {
      return json ? {scheduledSessions: json} : null;
    })
    .catch(function() {
      throw new CouldNotFetchDataError();
    });
};

function getFetchHeaders() {
  var headers = {};
  maybeSet(headers, "If-Modified-Since", localStorage.getItem("codScheduledSessionsLastModified"));
  maybeSet(headers, "If-None-Match", localStorage.getItem("codScheduledSessionsETag"));
  return headers;
}

function maybeSet(obj, key, value) {
  if (value) {
    obj[key] = value;
  }
}

function CouldNotFetchDataError(message) {
  this.name = "CouldNotFetchDataError";
  this.message = message || "Could not fetch data.";
  this.stack = (new Error()).stack;
}
CouldNotFetchDataError.prototype = Object.create(Error.prototype);
CouldNotFetchDataError.prototype.constructor = CouldNotFetchDataError;

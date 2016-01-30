var _ = require("lodash");

exports.CHOSEN_SESSIONS_STORAGE_KEY = "chosenSessions";

exports.getChosenSessions = function() {
  var chosenSessions = localStorage.getItem(exports.CHOSEN_SESSIONS_STORAGE_KEY) || "[]";
  return JSON.parse(chosenSessions);
};

exports.addChosenSessionId = function(sessionId) {
  var chosenSessions = exports.getChosenSessions();
  if (!_.some(chosenSessions, function(el) {return el === sessionId;})) {
    chosenSessions.push(sessionId);
  }
  var chosenSessionsString = JSON.stringify(chosenSessions);
  localStorage.setItem(exports.CHOSEN_SESSIONS_STORAGE_KEY, chosenSessionsString);
};

exports.removeChosenSessionId = function(sessionId) {
  var chosenSessions = exports.getChosenSessions();
  _.pull(chosenSessions, sessionId);
  var chosenSessionsString = JSON.stringify(chosenSessions);
  localStorage.setItem(exports.CHOSEN_SESSIONS_STORAGE_KEY, chosenSessionsString);
};

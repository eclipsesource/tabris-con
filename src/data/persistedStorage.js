var _ = require("lodash");
var stringUtility = require("../stringUtility");

exports.CHOSEN_SESSIONS_STORAGE_KEY = "chosenSessions";

exports.PREVIEW_CATEGORIES = "previewCategories";
exports.CATEGORIES = "categories";
exports.SESSIONS = "sessions";
exports.BLOCKS = "blocks";

var CONFERENCE_DATA_PROPERTIES = [exports.PREVIEW_CATEGORIES, exports.CATEGORIES, exports.SESSIONS, exports.BLOCKS];

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

defineSetMethods();
defineGetMethods();

function defineSetMethods() {
  CONFERENCE_DATA_PROPERTIES.forEach(function(property) {
    exports["set" + stringUtility.capitalizeFirstLetter(property)] = function(appConfig, value) {
      setValue(appConfig, property, value);
    };
  });
}

function defineGetMethods() {
  CONFERENCE_DATA_PROPERTIES.forEach(function(property) {
    exports["get" + stringUtility.capitalizeFirstLetter(property)] = function(appConfig) {
      return getValue(appConfig, property);
    };
  });
}

function setValue(appConfig, property, value) {
  var itemObject = {};
  itemObject[appConfig.DATA_FORMAT] = value;
  localStorage.setItem(property, JSON.stringify(itemObject));
}

function getValue(appConfig, property) {
  var itemString = localStorage.getItem(property);
  return itemString && itemString !== "undefined" ? JSON.parse(itemString)[appConfig.DATA_FORMAT] : null;
}

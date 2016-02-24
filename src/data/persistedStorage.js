var _ = require("lodash");
var stringUtility = require("../stringUtility");
var config = require("../../config");

exports.ATTENDED_SESSION_STORAGE_KEY = "attendedSessions";

exports.PREVIEW_CATEGORIES = "previewCategories";
exports.CATEGORIES = "categories";
exports.SESSIONS = "sessions";
exports.KEYNOTES = "keynotes";
exports.BLOCKS = "blocks";

var CONFERENCE_DATA_PROPERTIES = [
  exports.PREVIEW_CATEGORIES, exports.CATEGORIES, exports.SESSIONS, exports.BLOCKS, exports.KEYNOTES
];

exports.getAttendedSessions = function() {
  var attendedSessions = localStorage.getItem(exports.ATTENDED_SESSION_STORAGE_KEY) || "[]";
  return JSON.parse(attendedSessions);
};

exports.addAttendedSessionId = function(sessionId) {
  var attendedSessions = exports.getAttendedSessions();
  if (!_.some(attendedSessions, function(el) {return el === sessionId;})) {
    attendedSessions.push(sessionId);
  }
  var attendedSessionsString = JSON.stringify(attendedSessions);
  localStorage.setItem(exports.ATTENDED_SESSION_STORAGE_KEY, attendedSessionsString);
};

exports.removeAttendedSessionId = function(sessionId) {
  var attendedSessions = exports.getAttendedSessions();
  _.pull(attendedSessions, sessionId);
  var attendedSessionsString = JSON.stringify(attendedSessions);
  localStorage.setItem(exports.ATTENDED_SESSION_STORAGE_KEY, attendedSessionsString);
};

exports.conferenceDataStored = function() {
  var data = [
    exports.getSessions(),
    exports.getPreviewCategories(),
    exports.getCategories(),
    exports.getKeynotes(),
    exports.getBlocks()
  ];
  return data.every(function(data) {return !!data;});
};

exports.removeConferenceData = function() {
  exports.removeSessions();
  exports.removePreviewCategories();
  exports.removeCategories();
  exports.removeKeynotes();
  exports.removeBlocks();
};

defineSetMethods();
defineGetMethods();
defineRemoveMethods();

function defineSetMethods() {
  CONFERENCE_DATA_PROPERTIES.forEach(function(property) {
    exports["set" + stringUtility.capitalizeFirstLetter(property)] = function(value) {
      setValue(property, value);
    };
  });
}

function defineGetMethods() {
  CONFERENCE_DATA_PROPERTIES.forEach(function(property) {
    exports["get" + stringUtility.capitalizeFirstLetter(property)] = function() {
      return getValue(property);
    };
  });
}

function defineRemoveMethods() {
  CONFERENCE_DATA_PROPERTIES.forEach(function(property) {
    exports["remove" + stringUtility.capitalizeFirstLetter(property)] = function() {
      return remove(property);
    };
  });
}

function setValue(property, value) {
  var itemObject = {};
  itemObject[config.DATA_FORMAT] = value;
  localStorage.setItem(property, JSON.stringify(itemObject));
}

function getValue(property) {
  var itemString = localStorage.getItem(property);
  return itemString && itemString !== "undefined" ? JSON.parse(itemString)[config.DATA_FORMAT] : null;
}

function remove(property) {
  localStorage.removeItem(property);
}

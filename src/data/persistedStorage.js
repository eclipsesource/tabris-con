var _ = require("lodash");
var stringUtility = require("../stringUtility");
var config = require("../../config");

exports.ATTENDED_BLOCK_STORAGE_KEY = "attendedBlocks";

exports.PREVIEW_CATEGORIES = "previewCategories";
exports.CATEGORIES = "categories";
exports.SESSIONS = "sessions";
exports.KEYNOTES = "keynotes";
exports.BLOCKS = "blocks";

var CONFERENCE_DATA_PROPERTIES = [
  exports.PREVIEW_CATEGORIES, exports.CATEGORIES, exports.SESSIONS, exports.BLOCKS, exports.KEYNOTES
];

exports.getAttendedBlocks = function() {
  var attendedBlocks = localStorage.getItem(exports.ATTENDED_BLOCK_STORAGE_KEY) || "[]";
  return JSON.parse(attendedBlocks);
};

exports.addAttendedBlockId = function(sessionId) {
  var attendedBlocks = exports.getAttendedBlocks();
  if (!_.some(attendedBlocks, function(el) {return el === sessionId;})) {
    attendedBlocks.push(sessionId);
  }
  var attendedBlocksString = JSON.stringify(attendedBlocks);
  localStorage.setItem(exports.ATTENDED_BLOCK_STORAGE_KEY, attendedBlocksString);
};

exports.removeAttendedBlockId = function(sessionId) {
  var attendedBlocks = exports.getAttendedBlocks();
  _.pull(attendedBlocks, sessionId);
  var attendedBlocksString = JSON.stringify(attendedBlocks);
  localStorage.setItem(exports.ATTENDED_BLOCK_STORAGE_KEY, attendedBlocksString);
};

defineSetMethods();
defineGetMethods();

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

function setValue(property, value) {
  var itemObject = {};
  itemObject[config.DATA_FORMAT] = value;
  localStorage.setItem(property, JSON.stringify(itemObject));
}

function getValue(property) {
  var itemString = localStorage.getItem(property);
  return itemString && itemString !== "undefined" ? JSON.parse(itemString)[config.DATA_FORMAT] : null;
}

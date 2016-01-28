var Promise = require("promise");
var viewDataAdapter = require("../data/viewDataAdapter");
var dataExtractor = require("../data/dataExtractor");
var dataLoader = require("../data/dataLoader");
var config = require("../../config");

var conferenceData;

exports.getPreviewCategories = function() {
  var previewCategories = dataExtractor.extractPreviewCategories(getConferenceData());
  return viewDataAdapter.adaptPreviewCategories(previewCategories);
};

exports.getCategory = function(categoryId) {
  var category = dataExtractor.extractCategory(getConferenceData(), categoryId);
  return viewDataAdapter.adaptCategory(category);
};

exports.getSession = function(sessionId) {
  var session = dataExtractor.extractSession(getConferenceData(), sessionId);
  return viewDataAdapter.adaptSession(session);
};

exports.getBlocks = function() {
  var blocks = dataExtractor.extractBlocks(getConferenceData());
  return viewDataAdapter.adaptBlocks(config, blocks);
};

exports.asyncGetPreviewCategories = function() {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(exports.getPreviewCategories());
    });
  });
};

exports.asyncGetCategory = function(categoryId) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(exports.getCategory(categoryId));
    });
  });
};

exports.asyncGetSession = function(sessionId) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(exports.getSession(sessionId));
    });
  });
};

exports.asyncGetBlocks = function() {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(exports.getBlocks());
    });
  });
};

function getConferenceData() {
  conferenceData = conferenceData || dataLoader.load();
  return conferenceData;
}

var Promise = require("promise");
var viewDataAdapter = require("../data/viewDataAdapter");
var googleIODataExtractor = require("../data/googleIODataExtractor");
var googleIODataLoader = require("../data/googleIODataLoader");

var conferenceData;

exports.getPreviewCategories = function() {
  var previewCategories = googleIODataExtractor.extractPreviewCategories(getConferenceData());
  return viewDataAdapter.adaptPreviewCategories(previewCategories);
};

exports.getCategory = function(categoryId) {
  var category = googleIODataExtractor.extractCategory(getConferenceData(), categoryId);
  return viewDataAdapter.adaptCategory(category);
};

exports.getSession = function(sessionId) {
  var session = googleIODataExtractor.extractSession(getConferenceData(), sessionId);
  return viewDataAdapter.adaptSession(session);
};

exports.getBlocks = function() {
  var blocks = googleIODataExtractor.extractBlocks(getConferenceData());
  return viewDataAdapter.adaptBlocks(blocks);
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

exports.asyncGetSession = function(categoryId) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(exports.getSession(categoryId));
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
  conferenceData = conferenceData || googleIODataLoader.load();
  return conferenceData;
}

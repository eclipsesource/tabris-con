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

function getConferenceData() {
  conferenceData = conferenceData || googleIODataLoader.load();
  return conferenceData;
}

var collectionViewDataAdapter = require("../data/collectionViewDataAdapter");
var googleIODataExtractor = require("../data/googleIODataExtractor");
var googleIODataLoader = require("../data/googleIODataLoader");

var conferenceData;

exports.getPreviewCategories = function() {
  var previewCategories = googleIODataExtractor.extractPreviewCategories(getConferenceData());
  return collectionViewDataAdapter.adaptPreviewCategories(previewCategories);
};

exports.getCategory = function(categoryId) {
  var category = googleIODataExtractor.extractCategory(getConferenceData(), categoryId);
  return collectionViewDataAdapter.adaptCategory(category);
};

function getConferenceData() {
  conferenceData = conferenceData || googleIODataLoader.load();
  return conferenceData;
}

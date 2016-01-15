var collectionViewDataAdapter = require("../data/collectionViewDataAdapter");
var googleIODataExtractor = require("../data/googleIODataExtractor");
var googleIODataLoader = require("../data/googleIODataLoader");

var conferenceData;

exports.getPreviewCategories = function() {
  var previewCategories = googleIODataExtractor.extractPreviewCategories(getConferenceData());
  return collectionViewDataAdapter.adaptPreviewCategories(previewCategories);
};

function getConferenceData() {
  conferenceData = conferenceData || googleIODataLoader.load();
  return conferenceData;
}

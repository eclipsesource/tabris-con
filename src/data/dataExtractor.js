var config = require("../../config");
var concreteDataExtractor = require("./" + config.DATA_FORMAT + "DataExtractor");

exports.extractPreviewCategories = function(conferenceData) {
  return concreteDataExtractor.extractPreviewCategories(conferenceData);
};

exports.extractCategory = function(conferenceData, categoryId) {
  return concreteDataExtractor.extractCategory(conferenceData, categoryId);
};

exports.extractSession = function(conferenceData, sessionId) {
  return concreteDataExtractor.extractSession(conferenceData, sessionId);
};

exports.extractBlocks = function(conferenceData) {
  return concreteDataExtractor.extractBlocks(conferenceData);
};
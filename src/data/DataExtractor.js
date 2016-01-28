var config = require("../../config");
var extractorModuleName = capitalizeFirstLetter(config.DATA_FORMAT) + "DataExtractor";
var ConcreteDataExtractor = require("./" + extractorModuleName);

module.exports = function(conferenceData) {

  var concreteDataExtractor = new ConcreteDataExtractor(conferenceData, config);

  this.extractPreviewCategories = function() {
    return concreteDataExtractor.extractPreviewCategories();
  };

  this.extractCategory = function(categoryId) {
    return concreteDataExtractor.extractCategory(categoryId);
  };

  this.extractSession = function(sessionId) {
    return concreteDataExtractor.extractSession(sessionId);
  };

  this.extractBlocks = function() {
    return concreteDataExtractor.extractBlocks();
  };
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
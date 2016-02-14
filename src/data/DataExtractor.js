var config = require("../../config");
var capitalizeFirstLetter = require("../stringUtility.js").capitalizeFirstLetter;
var extractorModuleName = capitalizeFirstLetter(config.DATA_FORMAT) + "DataExtractor";
var ConcreteDataExtractor = require("./" + extractorModuleName);

module.exports = function(conferenceData) {

  var concreteDataExtractor = new ConcreteDataExtractor(conferenceData, config);

  this.extractPreviewCategories = function() {
    return concreteDataExtractor.extractPreviewCategories();
  };

  this.extractCategories = function() {
    return concreteDataExtractor.extractCategories();
  };

  this.extractKeynotes = function() {
    return concreteDataExtractor.extractKeynotes();
  };

  this.extractSessions = function() {
    return concreteDataExtractor.extractSessions();
  };

  this.extractBlocks = function() {
    return concreteDataExtractor.extractBlocks();
  };
};

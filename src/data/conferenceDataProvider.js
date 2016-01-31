var conferenceData;
var config = require("../../config");
var persistedStorage = require("../data/persistedStorage");
var dataLoader = require("../data/dataLoader");
var DataExtractor = require("../data/DataExtractor");

exports.get = function() {
  if (conferenceData) {
    return conferenceData;
  }
  if (!dataCached()) {
    var rawData = dataLoader.load();
    var dataExtractor = new DataExtractor(rawData);
    persistedStorage.setSessions(config, dataExtractor.extractSessions());
    persistedStorage.setPreviewCategories(config, dataExtractor.extractPreviewCategories());
    persistedStorage.setCategories(config, dataExtractor.extractCategories());
    persistedStorage.setBlocks(config, dataExtractor.extractBlocks());
  }
  conferenceData = getDataFromCache();
  return conferenceData;
};

function getDataFromCache() {
  return {
    sessions: persistedStorage.getSessions(config),
    previewCategories: persistedStorage.getPreviewCategories(config),
    categories: persistedStorage.getCategories(config),
    blocks: persistedStorage.getBlocks(config)
  };
}

function dataCached() {
  var data = [
    persistedStorage.getSessions(config),
    persistedStorage.getPreviewCategories(config),
    persistedStorage.getCategories(config),
    persistedStorage.getBlocks(config)
  ];
  return data.every(function(data) {return !!data;});
}

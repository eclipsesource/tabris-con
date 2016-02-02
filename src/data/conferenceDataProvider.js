var conferenceData;
var persistedStorage = require("../data/persistedStorage");
var dataLoader = require("../data/dataLoader");
var DataExtractor = require("../data/DataExtractor");

exports.get = function() {
  if (device.platform === "UWP") {
    return getData();
  }
  if (conferenceData) {
    return conferenceData;
  }
  if (!dataCached()) {
    var rawData = dataLoader.load();
    var dataExtractor = new DataExtractor(rawData);
    persistedStorage.setSessions(dataExtractor.extractSessions());
    persistedStorage.setPreviewCategories(dataExtractor.extractPreviewCategories());
    persistedStorage.setCategories(dataExtractor.extractCategories());
    persistedStorage.setBlocks(dataExtractor.extractBlocks());
  }
  conferenceData = getDataFromCache();
  return conferenceData;
};

function getData() {
  var rawData = dataLoader.load();
  var dataExtractor = new DataExtractor(rawData);
  return {
    sessions: dataExtractor.extractSessions(),
    previewCategories: dataExtractor.extractPreviewCategories(),
    categories: dataExtractor.extractCategories(),
    blocks: dataExtractor.extractBlocks()
  };
}

function getDataFromCache() {
  return {
    sessions: persistedStorage.getSessions(),
    previewCategories: persistedStorage.getPreviewCategories(),
    categories: persistedStorage.getCategories(),
    blocks: persistedStorage.getBlocks()
  };
}

function dataCached() {
  var data = [
    persistedStorage.getSessions(),
    persistedStorage.getPreviewCategories(),
    persistedStorage.getCategories(),
    persistedStorage.getBlocks()
  ];
  return data.every(function(data) {return !!data;});
}

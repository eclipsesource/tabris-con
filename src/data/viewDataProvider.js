var Promise = require("promise");
var viewDataAdapter = require("../data/viewDataAdapter");
var persistedStorage = require("../data/persistedStorage");
var DataExtractor = require("../data/DataExtractor");
var dataLoader = require("../data/dataLoader");
var config = require("../../config");
var _ = require("lodash");

var conferenceData;

exports.getPreviewCategories = function() {
  return viewDataAdapter.adaptPreviewCategories(getConferenceData().previewCategories);
};

exports.getCategory = function(categoryId) {
  var category = _.find(getConferenceData().categories, function(category) {return category.id === categoryId;});
  return viewDataAdapter.adaptCategory(category);
};

exports.getSession = function(sessionId) {
  var session = _.find(getConferenceData().sessions, function(session) {
    return session.id === sessionId;
  });
  return viewDataAdapter.adaptSession(session);
};

exports.getBlocks = function() {
  return viewDataAdapter.adaptBlocks(config, getConferenceData().blocks);
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
}

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

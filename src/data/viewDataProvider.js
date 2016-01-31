var Promise = require("promise");
var _ = require("lodash");
var viewDataAdapter = require("../data/viewDataAdapter");
var conferenceDataProvider = require("./conferenceDataProvider");
var config = require("../../config");

exports.getPreviewCategories = function() {
  return viewDataAdapter.adaptPreviewCategories(conferenceDataProvider.get().previewCategories);
};

exports.getCategory = function(categoryId) {
  var categories = conferenceDataProvider.get().categories;
  var category = _.find(categories, function(category) {return category.id === categoryId;});
  return viewDataAdapter.adaptCategory(category);
};

exports.getSession = function(sessionId) {
  var session = _.find(conferenceDataProvider.get().sessions, function(session) {
    return session.id === sessionId;
  });
  return viewDataAdapter.adaptSession(session);
};

exports.getBlocks = function() {
  return viewDataAdapter.adaptBlocks(config, conferenceDataProvider.get().blocks);
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

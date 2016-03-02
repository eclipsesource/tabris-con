/*globals Promise:true*/

var _ = require("lodash");
var viewDataAdapter = require("./viewDataAdapter");
var conferenceDataProvider = require("./conferenceDataProvider");
var attendedBlockProvider = require("./attendedBlockProvider");
var codRemoteService = require("./codRemoteService");
var codFeedbackService = require("./helpers/codFeedbackService");
var loginService = require("./helpers/loginService");
var getSessionsInTimeframe = require("./getSessionsInTimeframe");
Promise = require("promise");

exports.getKeynote = function(keynoteId) {
  return conferenceDataProvider.get().then(function(data) {
    var keynote = _.find(data.keynotes, function(keynote) {
      return keynote.id === keynoteId;
    });
    return viewDataAdapter.adaptKeynote(keynote);
  });
};

exports.getBlocks = function() {
  var blocks = conferenceDataProvider.get().blocks;
  var attendedBlocks = attendedBlockProvider.getBlocks();
  return viewDataAdapter.adaptBlocks(_.union(blocks, attendedBlocks));
};

exports.getPreviewCategories = function() {
  return conferenceDataProvider.get().then(function(data) {
    return viewDataAdapter.adaptPreviewCategories(data.previewCategories);
  });
};

exports.getCategory = function(categoryId) {
  return conferenceDataProvider.get().then(function(data) {
    var category = _.find(data.categories, function(category) {return category.id === categoryId;});
    return viewDataAdapter.adaptCategory(category);
  });
};

exports.getKeynotes = function() {
  return conferenceDataProvider.get().then(function(data) {
    return viewDataAdapter.adaptKeynotes(data.keynotes);
  });
};

exports.getSession = function(sessionId) {
  return conferenceDataProvider.get().then(function(data) {
    var session = _.find(data.sessions, function(session) {
      return session.id === sessionId;
    });
    return viewDataAdapter.adaptSession(session);
  });
};

exports.getBlocks = function() {
  return Promise.all([conferenceDataProvider.get(), attendedBlockProvider.getBlocks()])
    .then(function(values) {
      var conferenceData = values[0];
      var blocks = values[1];
      return viewDataAdapter.adaptBlocks(_.union(conferenceData.blocks, blocks));
    });
};

exports.getSessionIdIndicatorStates = function() {
  if (!loginService.isLoggedIn()) {
    return Promise.resolve([]);
  }
  return Promise.all([attendedBlockProvider.getBlocks(), codRemoteService.evaluations()])
    .then(function(values) {
      var blocks = values[0];
      var evaluations = values[1];
      return codFeedbackService.getSessionsIndicatorState(blocks, evaluations);
    })
    .catch(function() {return [];});
};

exports.getSessionsInTimeframe = function(timestamp1, timestamp2) {
  return getSessionsInTimeframe(timestamp1, timestamp2).then(function(sessions) {
    return viewDataAdapter.adaptCategory({sessions: sessions});
  });
};

var _ = require("lodash");
var viewDataAdapter = require("../data/viewDataAdapter");
var conferenceDataProvider = require("./conferenceDataProvider");
var attendedBlockProvider = require("./attendedBlockProvider");
var TimezonedDate = require("../TimezonedDate");
var loginService = require("../loginService");
var codRemoteService = require("../codRemoteService");
var codFeedbackService = require("../codFeedbackService");
var Promise = require("promise");

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
  return conferenceDataProvider.get().then(function(data) {
    return attendedBlockProvider.getBlocks().then(function(blocks) {
      return viewDataAdapter.adaptBlocks(_.union(data.blocks, blocks));
    });
  });
};

exports.getScheduleBlocks = function() {
  var promises = [exports.getBlocks()];
  if (loginService.isLoggedIn()) {
    promises.push(codRemoteService.evaluations());
  }
  return Promise.all(promises)
    .then(function(values) {
      var blocksEvaluations = {blocks: values[0], evaluations: values[1]};
      codFeedbackService.addFeedbackIndicatorState(blocksEvaluations);
      return blocksEvaluations.blocks;
    });
};

exports.getSessionsStartingInTimeframe = function(timestamp1, timestamp2) {
  return conferenceDataProvider.get().then(function(data) {
    var sessions = _(data.sessions)
      .sortBy("startTimestamp")
      .filter(function(session) {
        return new TimezonedDate(timestamp1).toJSON() <= new TimezonedDate(session.startTimestamp).toJSON() &&
               new TimezonedDate(timestamp2).toJSON() > new TimezonedDate(session.startTimestamp).toJSON();
      }).value();
    return viewDataAdapter.adaptCategory({sessions: sessions});
  });
};

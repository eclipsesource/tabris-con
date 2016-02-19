var Promise = require("promise");
var _ = require("lodash");
var viewDataAdapter = require("../data/viewDataAdapter");
var conferenceDataProvider = require("./conferenceDataProvider");
var attendedBlockProvider = require("./attendedBlockProvider");
var TimezonedDate = require("../TimezonedDate");
var loginService = require("../loginService");
var codRemoteService = require("../codRemoteService");
var codFeedbackService = require("../codFeedbackService");

exports.getPreviewCategories = function() {
  return viewDataAdapter.adaptPreviewCategories(conferenceDataProvider.get().previewCategories);
};

exports.getCategory = function(categoryId) {
  var categories = conferenceDataProvider.get().categories;
  var category = _.find(categories, function(category) {return category.id === categoryId;});
  return viewDataAdapter.adaptCategory(category);
};

exports.getKeynotes = function() {
  var keynotes = conferenceDataProvider.get().keynotes;
  return viewDataAdapter.adaptKeynotes(keynotes);
};

exports.getSession = function(sessionId) {
  var session = _.find(conferenceDataProvider.get().sessions, function(session) {
    return session.id === sessionId;
  });
  return viewDataAdapter.adaptSession(session);
};

exports.getKeynote = function(keynoteId) {
  var keynote = _.find(conferenceDataProvider.get().keynotes, function(keynote) {
    return keynote.id === keynoteId;
  });
  return viewDataAdapter.adaptKeynote(keynote);
};

exports.getSessionsStartingInTimeframe = function(timestamp1, timestamp2) {
  var sessions = _(conferenceDataProvider.get().sessions)
    .sortBy("startTimestamp")
    .filter(function(session) {
      return new TimezonedDate(timestamp1).toJSON() <= new TimezonedDate(session.startTimestamp).toJSON() &&
             new TimezonedDate(timestamp2).toJSON() > new TimezonedDate(session.startTimestamp).toJSON();
    }).value();
  return viewDataAdapter.adaptTimeframe({sessions: sessions});
};

exports.getBlocks = function() {
  var blocks = conferenceDataProvider.get().blocks;
  var attendedBlocks = attendedBlockProvider.getBlocks();
  return viewDataAdapter.adaptBlocks(_.union(blocks, attendedBlocks));
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

exports.asyncGetKeynotes = function() {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(exports.getKeynotes());
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

exports.asyncGetScheduleBlocks = function() {
  var promises = [exports.asyncGetBlocks()];
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

exports.asyncGetSessionsStartingInTimeframe = function(timestamp1, timestamp2) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(exports.getSessionsStartingInTimeframe(timestamp1, timestamp2));
    });
  });
};

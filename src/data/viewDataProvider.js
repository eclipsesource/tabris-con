var _ = require("lodash");
var viewDataAdapter = require("../data/viewDataAdapter");
var conferenceDataProvider = require("./conferenceDataProvider");
var attendedBlockProvider = require("./attendedBlockProvider");
var loginService = require("../loginService");
var codRemoteService = require("../codRemoteService");
var codFeedbackService = require("../codFeedbackService");
var getSessionsInTimeframe = require("../getSessionsInTimeframe");
var isFeedbackTime = require("../isFeedbackTime");

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
  return exports.getBlocks()
    .then(function(blocks) {
      if (loginService.isLoggedIn() && isFeedbackTime()) {
        return codRemoteService.evaluations()
          .then(function(evaluations) {
            return processScheduleBlocks(blocks, evaluations);
          })
          .catch(function() {return processScheduleBlocks(blocks);});
      } else {
        return processScheduleBlocks(blocks);
      }
    });
};

function processScheduleBlocks(blocks, evaluations) {
  var blocksEvaluations = {blocks: blocks};
  if (evaluations) {
    blocksEvaluations.evaluations = evaluations;
  }
  codFeedbackService.addFeedbackIndicatorState(blocksEvaluations);
  return blocksEvaluations.blocks;
}

exports.getSessionsInTimeframe = function(timestamp1, timestamp2) {
  return getSessionsInTimeframe(timestamp1, timestamp2).then(function(sessions) {
    return viewDataAdapter.adaptCategory({sessions: sessions});
  });
};

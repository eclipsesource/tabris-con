var _ = require("underscore");
var moment = require("moment");

exports.adaptPreviewCategories = function(previewCategories) {
  var previewCategories = JSON.parse(JSON.stringify(previewCategories));
  var result = [];
  result.push({type: "separator"});
  previewCategories.forEach(function(categoryPreview) {
    result.push({type: "title", id: categoryPreview.id, title: categoryPreview.title});
    result = _.union(result, getCategoryPreviewSessions(categoryPreview));
    result.push({type: "separator"});
  });
  return result;
};

exports.adaptCategory = function(category) {
  var category = JSON.parse(JSON.stringify(category));
  var result = [];
  category.sessions.forEach(function(session) {
    var adaptedSession = adaptSession(session);
    result.push(adaptedSession);
  });
  return result;
};

function adaptSession(session) {
  session.timeframe = moment(session.startTimestamp).format("D MMM - HH:MM") + " / " + moment(session.endTimestamp).format("HH:MM");
  delete session.startTimestamp;
  delete session.endTimestamp;
  return _.extend({}, session, {type: "session"});
}

function getCategoryPreviewSessions(categoryPreview) {
  var sessions = [];
  categoryPreview.sessions.forEach(function(session) {
    sessions.push(adaptSession(session));
  });
  return sessions;
}

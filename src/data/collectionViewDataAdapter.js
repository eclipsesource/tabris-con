var _ = require("underscore");

exports.adaptPreviewCategories = function(previewCategories) {
  var result = [];
  result.push({type: "separator"});
  previewCategories.forEach(function(categoryPreview) {
    result.push({type: "title", id: categoryPreview.id, title: categoryPreview.title});
    result = _.union(result, getCategoryPreviewSessions(categoryPreview));
    result.push({type: "separator"});
  });
  return result;
};

function getCategoryPreviewSessions(categoryPreview) {
  var sessions = [];
  categoryPreview.sessions.forEach(function(session) {
    sessions.push(_.extend({}, session, {type: "session"}));
  });
  return sessions;
}

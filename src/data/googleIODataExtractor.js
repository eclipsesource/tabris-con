var PREVIEW_CATEGORIES = ["TOPIC", "THEME"];

exports.extractPreviewCategories = function(conferenceData) {
  var previewCategories = [];
  var tagNameMap = createTagNameMap(conferenceData);
  getPreviewCategoryTags(conferenceData).forEach(function(tagToPreview) {
    previewCategories.push({
      id: tagToPreview,
      title: tagNameMap[tagToPreview],
      sessions: getPreviewSessions(tagToPreview)
    });
  });
  return previewCategories;

  function getPreviewSessions(tagToPreview) {
    // TODO: sort by date
    var previewSessions = [];
    var sessions = findSessionsWithTag(conferenceData, tagToPreview).slice(0, 2);
    sessions.forEach(function(session) {
      previewSessions.push({
        id: session.id,
        title: session.title,
        image: session.photoUrl,
        text: session.description
      });
    });
    return previewSessions;
  }
};

function getPreviewCategoryTags(conferenceData) {
  var tags = [];
  var tagObjects = conferenceData.sessionData.tags.filter(function(tag) {
    return PREVIEW_CATEGORIES.indexOf(tag.category) > -1;
  });
  tagObjects.forEach(function(tagObject) {
    tags.push(tagObject.tag);
  });
  return tags;
}


function findSessionsWithTag(conferenceData, tag) {
  return conferenceData.sessionData.sessions.filter(function(session) {
    return session.tags.indexOf(tag) > -1;
  });
}

function createTagNameMap(conferenceData) {
  var tagNameMap = {};
  conferenceData.sessionData.tags.forEach(function(tagObject) {
    tagNameMap[tagObject.tag] = tagObject.name;
  });
  return tagNameMap;
}
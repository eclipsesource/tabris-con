var PREVIEW_CATEGORIES = ["TOPIC", "THEME"];
var tagNameMap;

exports.extractPreviewCategories = function(conferenceData) {
  var previewCategories = [];
  getTagsForCategories(conferenceData, PREVIEW_CATEGORIES).forEach(function(tagToPreview) {
    var category = createCategory(conferenceData, tagToPreview, {sessionsLimit: 2});
    previewCategories.push(category);
  });
  return previewCategories;
};

exports.extractCategory = function(conferenceData, tag) {
  return createCategory(conferenceData, tag);
};

function getTagsForCategories(conferenceData, categories) {
  var tags = [];
  var tagObjects = conferenceData.sessionData.tags;
  if(categories) {
    tagObjects = tagObjects.filter(function(tag) {
      return categories.indexOf(tag.category) > -1;
    });
  }
  tagObjects.forEach(function(tagObject) {
    tags.push(tagObject.tag);
  });
  return tags;
}

function createCategory(conferenceData, tag, filter) {
  return {
    id: tag,
    title: findTagName(conferenceData, tag),
    sessions: getSessions(conferenceData, tag, filter ? filter.sessionsLimit : undefined)
  };
}

function findTagName(conferenceData, tag) {
  tagNameMap = tagNameMap || createTagNameMap(conferenceData);
  return tagNameMap[tag];
}

function createTagNameMap(conferenceData) {
  var tagNameMap = {};
  conferenceData.sessionData.tags.forEach(function(tagObject) {
    tagNameMap[tagObject.tag] = tagObject.name;
  });
  return tagNameMap;
}

function getSessions(conferenceData, tag, limit) {
  // TODO: implement sorting
  var ioSessions = findSessionsWithTag(conferenceData, tag);
  if(limit) {
    ioSessions = ioSessions.slice(0, limit);
  }
  return adaptIOSessions(ioSessions);
}

function findSessionsWithTag(conferenceData, tag) {
  return conferenceData.sessionData.sessions.filter(function(session) {
    return session.tags.indexOf(tag) > -1;
  });
}

function adaptIOSessions(ioSessions) {
  var adaptedSessions = [];
  ioSessions.forEach(function(session) {
    adaptedSessions.push({
      id: session.id,
      title: session.title,
      image: session.photoUrl,
      text: session.description,
      startTimestamp: session.startTimestamp,
      endTimestamp: session.endTimestamp
    });
  });
  return adaptedSessions;
}

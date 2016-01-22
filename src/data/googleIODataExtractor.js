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

exports.extractSession = function(conferenceData, id) {
  var googleIOSession = getGoogleIOSession(conferenceData, id);
  return {
    title: googleIOSession.title,
    description: googleIOSession.description,
    room: findRoom(conferenceData, googleIOSession.room),
    image: googleIOSession.photoUrl,
    startTimestamp: googleIOSession.startTimestamp,
    endTimestamp: googleIOSession.endTimestamp,
    speakers: findSpeakers(conferenceData, googleIOSession.speakers)
  };
};

exports.extractBlocks = function(conferenceData) {
  var blocks = [];
  conferenceData.blocks.blocks
    .filter(function(googleIOBlock) {
      return googleIOBlock.type !== "free";
    })
    .forEach(function(googleIOBlock) {
      blocks.push({
        title: googleIOBlock.title,
        room: googleIOBlock.subtitle,
        startTimestamp: googleIOBlock.start,
        endTimestamp: googleIOBlock.end
      });
    });
  return blocks;
};

function findRoom(conferenceData, roomId) {
  var googleIORoom = conferenceData.sessionData.rooms.filter(function(room) {
    return room.id === roomId;
  });
  return googleIORoom.length > 0 ? googleIORoom[0].name : undefined;
}

function findSpeakers(conferenceData, googleIOSessionSpeakers) {
  var speakers = [];
  conferenceData.sessionData.speakers.filter(function(speaker) {
    return googleIOSessionSpeakers.indexOf(speaker.id) > -1;
  }).forEach(function(googleIOSpeaker) {
    speakers.push({
      name: googleIOSpeaker.name,
      bio: googleIOSpeaker.bio || null,
      image: googleIOSpeaker.thumbnailUrl || null,
      company: googleIOSpeaker.company || null
    });
  });
  return speakers;
}

function getTagsForCategories(conferenceData, categories) {
  var tags = [];
  conferenceData.sessionData.tags.filter(function(tag) {
    return categories.indexOf(tag.category) > -1;
  }).forEach(function(tagObject) {
    tags.push(tagObject.tag);
  });
  return tags;
}

function getGoogleIOSession(conferenceData, id) {
  var session;
  for (var i = 0; i < conferenceData.sessionData.sessions.length; i++) {
    if(conferenceData.sessionData.sessions[i].id === id) {
      session = conferenceData.sessionData.sessions[i];
      break;
    }
  }
  return session;
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
  var googleIOSessions = findSessionsWithTag(conferenceData, tag);
  if(limit) {
    googleIOSessions = googleIOSessions.slice(0, limit);
  }
  return adaptGoogleIOSessions(googleIOSessions);
}

function findSessionsWithTag(conferenceData, tag) {
  return conferenceData.sessionData.sessions.filter(function(session) {
    return session.tags.indexOf(tag) > -1;
  });
}

function adaptGoogleIOSessions(googleIOSessions) {
  var adaptedSessions = [];
  googleIOSessions.forEach(function(session) {
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

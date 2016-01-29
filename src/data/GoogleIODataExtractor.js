var PREVIEW_CATEGORIES = ["TOPIC", "THEME"];
var tagNameMap;
var _ = require("lodash");

module.exports = function(conferenceData) {
  var conferenceData = _.cloneDeep(conferenceData);

  this.extractPreviewCategories = function() {
    return getTagsForCategories(PREVIEW_CATEGORIES)
      .map(function(tagToPreview) {
        return createCategory(tagToPreview, {sessionsLimit: 2});
      });
  };

  this.extractCategory = function(tag) {
    return createCategory(tag);
  };

  this.extractSession = function(id) {
    var googleIOSession = findGoogleIOSession(id);
    return {
      title: googleIOSession.title,
      description: googleIOSession.description,
      room: getGoogleIOSessionRoom(googleIOSession),
      image: googleIOSession.photoUrl,
      startTimestamp: googleIOSession.startTimestamp,
      endTimestamp: googleIOSession.endTimestamp,
      speakers: findSpeakers(googleIOSession.speakers)
    };
  };

  this.extractBlocks = function() {
    return conferenceData.blocks.blocks
      .filter(function(googleIOBlock) {
        return googleIOBlock.type !== "free";
      })
      .map(function(googleIOBlock) {
        return {
          title: googleIOBlock.title,
          room: googleIOBlock.subtitle,
          startTimestamp: googleIOBlock.start,
          endTimestamp: googleIOBlock.end
        };
      });
  };

  function findSpeakers(googleIOSessionSpeakers) {
    return conferenceData.sessionData.speakers
      .filter(function(speaker) {
        return googleIOSessionSpeakers.indexOf(speaker.id) > -1;
      })
      .map(function(googleIOSpeaker) {
        return {
          name: googleIOSpeaker.name,
          bio: googleIOSpeaker.bio || null,
          image: googleIOSpeaker.thumbnailUrl || null,
          company: googleIOSpeaker.company || null
        };
      });
  }

  function getTagsForCategories(categories) {
    return _(conferenceData.sessionData.tags)
      .filter(function(tag) {
        return categories.indexOf(tag.category) > -1;
      })
      .map("tag").value();
  }

  function findGoogleIOSession(id) {
    return _.find(conferenceData.sessionData.sessions, function(session) {
      return session.id === id;
    });
  }

  function getGoogleIOSessionRoom(googleIOSession) {
    return _(conferenceData.sessionData.rooms)
      .find(function(room) {
        return room.id === googleIOSession.room;
      }).name;
  }

  function createCategory(tag, filter) {
    return {
      id: tag,
      title: getTagName(tag),
      sessions: getSessions(tag, filter ? filter.sessionsLimit : undefined)
    };
  }

  function getTagName(tag) {
    tagNameMap = tagNameMap || createTagNameMap();
    return tagNameMap[tag];
  }

  function createTagNameMap() {
    var tagNameMap = {};
    conferenceData.sessionData.tags.forEach(function(tagObject) {
      tagNameMap[tagObject.tag] = tagObject.name;
    });
    return tagNameMap;
  }

  function getSessions(tag, limit) {
    // TODO: sort
    return conferenceData.sessionData.sessions
      .filter(function(session) {
        return session.tags.indexOf(tag) > -1;
      })
      .slice(0, limit)
      .map(function(session) {
        return {
          id: session.id,
          title: session.title,
          image: session.photoUrl,
          text: session.description,
          startTimestamp: session.startTimestamp,
          endTimestamp: session.endTimestamp
        };
      });
  }
};

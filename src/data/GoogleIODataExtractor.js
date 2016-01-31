var PREVIEW_CATEGORIES = ["TOPIC", "THEME"];
var _ = require("lodash");

module.exports = function(conferenceData) {
  this.extractPreviewCategories = function() {
    return getTagsForCategories(PREVIEW_CATEGORIES)
      .map(function(tagToPreview) {
        return createCategory(tagToPreview, {sessionsLimit: 2});
      });
  };

  this.extractCategories = function() {
    var allCategories = _.map(conferenceData.sessionData.tags, "category");
    return getTagsForCategories(allCategories)
      .map(function(tagToPreview) {
        return createCategory(tagToPreview);
      });
  };

  this.extractSessions = function() {
    return _.map(conferenceData.sessionData.sessions, function(googleIOSession) {
      return {
        id: googleIOSession.id,
        title: googleIOSession.title,
        description: googleIOSession.description,
        room: getGoogleIOSessionRoom(googleIOSession),
        image: googleIOSession.photoUrl,
        startTimestamp: googleIOSession.startTimestamp,
        endTimestamp: googleIOSession.endTimestamp,
        speakers: findSpeakers(googleIOSession.speakers)
      };
    });
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
    var tagObject = _.find(conferenceData.sessionData.tags, function(tagObject) {
      return tagObject.tag === tag;
    });
    return tagObject.name || null;
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

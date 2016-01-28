var sanitizeHtml = require("sanitize-html");
var moment = require("moment-timezone");
var utility = require("../util");

var categoryIdNameMap;

module.exports = function(conferenceData, appConfig) {
  var conferenceData = utility.deepClone(conferenceData);

  assignCategoryTypes(conferenceData);

  this.extractPreviewCategories = function() {
    var previewCategories = [];
    var categoriesList = getCategoriesList({exclude: "SCHEDULE_ITEM"});
    categoriesList.forEach(function(category) {
      var cat = createCategory(category.id, {limit: 2});
      previewCategories.push(cat);
    });
    return previewCategories;
  };

  this.extractCategory = function(categoryId) {
    return createCategory(categoryId);
  };

  this.extractSession = function(sessionId) {
    var codSession = getCodSession(sessionId);
    return {
      title: codSession.title,
      description: stripHtml(codSession.abstract),
      room: codSession.room,
      startTimestamp: adaptCodTime(codSession.start),
      endTimestamp: adaptCodTime(codSession.end),
      speakers: adaptSpeakers(codSession.presenter)
    };
  };

  this.extractBlocks = function() {
    // TODO
  };

  function getCodSession(sessionId) {
    var session;
    for (var i = 0; i < conferenceData.scheduledSessions.length; i++) {
      if(conferenceData.scheduledSessions[i].id === sessionId) {
        session = conferenceData.scheduledSessions[i];
        break;
      }
    }
    return session;
  }

  function createCategory(categoryId, options) {
    return {
      id: categoryId,
      title: findCategoryName(categoryId),
      sessions: getSessions(categoryId, options ? options.limit : undefined)
    };
  }

  function createCategoryIdNameMap(){
    categoryIdNameMap = {};
    conferenceData.scheduledSessions.forEach(function(session) {
      categoryIdNameMap[session.categoryId] = session.categoryName;
    });
    return categoryIdNameMap;
  }

  function findCategoryName(categoryId) {
    return getCategoryIdNameMap()[categoryId];
  }

  function getCategoryIdNameMap() {
    categoryIdNameMap = categoryIdNameMap || createCategoryIdNameMap();
    return categoryIdNameMap;
  }

  function getCategoriesList(options) {
    var categories = utility.deepClone(getCategoryIdNameMap());
    if(options && options.exclude) {
      delete categories[options.exclude];
    }
    return Object.keys(categories).map(function(categoryId) {
      return {id: categoryId, name: categories[categoryId]};
    });
  }

  function getSessions(categoryId, limit) {
    var codSessions = findSessionWithCategory(categoryId);
    var sessions = limit ? codSessions.slice(0, limit) : codSessions;
    return adaptCodSessions(sessions);
  }

  function findSessionWithCategory(categoryId) {
    return conferenceData.scheduledSessions.filter(function(session) {
      return session.categoryId === categoryId;
    });
  }

  function adaptCodSessions(sessions) {
    var adaptedSessions = [];
    sessions.forEach(function(session) {
      var adaptedSession = {
        id: session.id,
        title: session.title,
        text: stripHtml(session.abstract),
        startTimestamp: adaptCodTime(session.start),
        endTimestamp: adaptCodTime(session.end)
      };
      adaptedSessions.push(adaptedSession);
    });
    return adaptedSessions;
  }

  function adaptCodTime(codTime) {
    return moment.tz(codTime, appConfig.CONFERENCE_TIMEZONE).toJSON();
  }

};

function assignCategoryTypes(conferenceData) {
  conferenceData.scheduledSessions.forEach(function(session) {
    session.categoryId = session.category.toUpperCase().replace(/ /g, "_");
    session.categoryName = session.category;
    delete session.category;
  });
  return conferenceData;
}

function adaptSpeakers(codSpeakers) {
  var adaptedSpeakers = [];
  codSpeakers.forEach(function(speaker) {
    var adaptedSpeaker = {
      name: speaker.fullname,
      bio: stripHtml(speaker.bio),
      company: speaker.organization,
      image: speaker.picture
    };
    adaptedSpeakers.push(adaptedSpeaker);
  });
  return adaptedSpeakers;
}

function stripHtml(hypertext) {
  return sanitizeHtml(hypertext, {allowedTags: [], allowedAttributes: []});
}

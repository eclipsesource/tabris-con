var sanitizeHtml = require("sanitize-html");
var moment = require("moment-timezone");
var _ = require("lodash");

var categoryIdNameMap;

module.exports = function(conferenceData, appConfig) {
  var conferenceData = _.cloneDeep(conferenceData);

  assignCategoryTypes(conferenceData);

  this.extractPreviewCategories = function() {
    return getCategoriesList({exclude: "SCHEDULE_ITEM"})
      .map(function(category) {
        return createCategory(category.id, {limit: 2});
      });
  };

  this.extractCategory = function(categoryId) {
    return createCategory(categoryId);
  };

  this.extractSession = function(sessionId) {
    var codSession = _.find(conferenceData.scheduledSessions, function(session) {
      return session.id === sessionId;
    });
    return {
      title: codSession.title,
      description: stripHtml(codSession.abstract),
      room: codSession.room,
      startTimestamp: adaptCodTime(codSession.start),
      endTimestamp: adaptCodTime(codSession.end),
      speakers: codSession.presenter.map(function(speaker) {
        return {
          name: speaker.fullname,
          bio: stripHtml(speaker.bio),
          company: speaker.organization,
          image: speaker.picture
        };
      })
    };
  };

  this.extractBlocks = function() {
    return _(conferenceData.scheduledSessions)
      .filter(function(codSession) {
        return codSession.type === "schedule_item";
      })
      .groupBy(function(item) {
        return item.title + "#" + item.start + "#" + item.end;
      })
      .map(function(aggregatedScheduleItem) {
        return {
          title: aggregatedScheduleItem[0].title,
          startTimestamp: adaptCodTime(aggregatedScheduleItem[0].start),
          endTimestamp: adaptCodTime(aggregatedScheduleItem[0].end),
          room: _.map(aggregatedScheduleItem, "room").join(", ")
        };
      })
      .sortBy("startTimestamp").value();
  };

  function createCategory(categoryId, options) {
    return {
      id: categoryId,
      title: getCategoryName(categoryId),
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

  function getCategoryName(categoryId) {
    return getCategoryIdNameMap()[categoryId];
  }

  function getCategoryIdNameMap() {
    categoryIdNameMap = categoryIdNameMap || createCategoryIdNameMap();
    return categoryIdNameMap;
  }

  function getCategoriesList(options) {
    var categories = _.cloneDeep(getCategoryIdNameMap());
    if(options && options.exclude) {
      delete categories[options.exclude];
    }
    return Object.keys(categories).map(function(categoryId) {
      return {id: categoryId, name: categories[categoryId]};
    });
  }

  function getSessions(categoryId, limit) {
    return _(conferenceData.scheduledSessions)
      .filter(function(session) {
        return session.categoryId === categoryId;
      })
      .slice(0, limit)
      .map(function(session) {
        return {
          id: session.id,
          title: session.title,
          text: stripHtml(session.abstract),
          startTimestamp: adaptCodTime(session.start),
          endTimestamp: adaptCodTime(session.end)
        };
      })
      .sortBy("startTimestamp").value();
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

function stripHtml(hypertext) {
  return sanitizeHtml(hypertext, {allowedTags: [], allowedAttributes: []});
}

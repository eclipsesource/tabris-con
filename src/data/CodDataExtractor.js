var sanitizeHtml = require("sanitize-html");
var moment = require("moment-timezone");
var _ = require("lodash");

module.exports = function(conferenceData, appConfig) {
  var conferenceData = _.cloneDeep(assignCategoryTypes(conferenceData));

  this.extractPreviewCategories = function() {
    return getCategoriesList({exclude: "SCHEDULE_ITEM"})
      .map(function(category) {
        return createCategory(category.id, {limit: 2});
      });
  };

  this.extractCategories = function() {
    return _(getCategoriesList())
      .filter(function(category) {
        return category.id !== "SCHEDULE_ITEM";
      })
      .map(function(category) {
        return createCategory(category.id);
      }).value();
  };

  this.extractSessions = function() {
    return conferenceData.scheduledSessions
      .filter(function(session) {return session.type !== "schedule_item";})
      .map(function(session) {
        return {
          id: session.id,
          title: session.title,
          description: stripHtml(session.abstract),
          room: session.room,
          startTimestamp: adaptCodTime(session.start),
          endTimestamp: adaptCodTime(session.end),
          speakers: session.presenter.map(function(speaker) {
            return {
              name: speaker.fullname,
              bio: stripHtml(speaker.bio),
              company: speaker.organization,
              image: speaker.picture
            };
          })
        };
      });
  };

  this.extractBlocks = function() {
    return _(conferenceData.scheduledSessions)
      .filter(function(codSession) {
        return codSession.type === "schedule_item";
      })
      .groupBy(function(item) {
        return item.title + "#" + item.start + "#" + item.end;
      })
      .map(function(group) {
        return {
          title: group[0].title,
          startTimestamp: adaptCodTime(group[0].start),
          endTimestamp: adaptCodTime(group[0].end),
          room: _.map(group, "room").join(", ")
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

  function getCategoryName(categoryId) {
    var session = _.find(conferenceData.scheduledSessions, function(session) {
      return session.categoryId === categoryId;
    });
    return session && session.categoryName ? session.categoryName : null;
  }

  function getCategoriesList(options) {
    return _(conferenceData.scheduledSessions)
      .filter(function(session) {return options && options.exclude ? options.exclude !== session.categoryId : true; })
      .map(function(session) {
        return {id: session.categoryId, name: session.categoryName};
      })
      .uniqWith(_.isEqual)
      .value();
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

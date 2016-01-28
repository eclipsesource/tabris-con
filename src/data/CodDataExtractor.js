var sanitizeHtml = require("sanitize-html");
var moment = require("moment");
var utility = require("../util");

var categoryIdNameMap;

module.exports = function(conferenceData) {
  var _conferenceData = prepare(conferenceData);

  this.extractPreviewCategories = function() {
    var previewCategories = [];
    var categoriesList = getCategoriesList(_conferenceData, {exclude: "SCHEDULE_ITEM"});
    categoriesList.forEach(function(category) {
      var cat = createCategory(_conferenceData, category.id, {limit: 2});
      previewCategories.push(cat);
    });
    return previewCategories;
  };

  this.extractCategory = function(categoryId) {
    return createCategory(_conferenceData, categoryId);
  };

  this.extractSession = function() {
    // TODO
  };

  this.extractBlocks = function() {
    // TODO
  };

};

function prepare(conferenceData) {
  var preparedConferenceData = utility.deepClone(conferenceData);
  preparedConferenceData.scheduledSessions.forEach(function(session) {
    session.categoryId = session.category.toUpperCase().replace(/ /g, "_");
    session.categoryName = session.category;
    delete session.category;
  });
  return preparedConferenceData;
}

function createCategory(conferenceData, categoryId, options) {
  return {
    id: categoryId,
    title: findCategoryName(conferenceData, categoryId),
    sessions: getSessions(conferenceData, categoryId, options ? options.limit : undefined)
  };
}

function createCategoryIdNameMap(conferenceData){
  categoryIdNameMap = {};
  conferenceData.scheduledSessions.forEach(function(session) {
    categoryIdNameMap[session.categoryId] = session.categoryName;
  });
  return categoryIdNameMap;
}

function findCategoryName(conferenceData, categoryId) {
  return getCategoryIdNameMap(conferenceData)[categoryId];
}

function getCategoryIdNameMap(conferenceData) {
  categoryIdNameMap = categoryIdNameMap || createCategoryIdNameMap(conferenceData);
  return categoryIdNameMap;
}

function getCategoriesList(conferenceData, options) {
  var categories = utility.deepClone(getCategoryIdNameMap(conferenceData));
  if(options && options.exclude) {
    delete categories[options.exclude];
  }
  return Object.keys(categories).map(function(categoryId) {
    return {id: categoryId, name: categories[categoryId]};
  });
}

function getSessions(conferenceData, categoryId, limit) {
  var codSessions = findSessionWithCategory(conferenceData, categoryId);
  var sessions = limit ? codSessions.slice(0, limit) : codSessions;
  return adaptCodSessions(sessions);
}

function adaptCodSessions(sessions) {
  var adaptedSessions = [];
  sessions.forEach(function(session) {
    var adaptedSession = {
      id: session.id,
      title: session.title,
      text: sanitizeHtml(session.abstract, {allowedTags: [], allowedAttributes: []}),
      startTimestamp: moment(session.start).toJSON(),
      endTimestamp: moment(session.end).toJSON()
    };
    adaptedSessions.push(adaptedSession);
  });
  return adaptedSessions;
}

function findSessionWithCategory(conferenceData, categoryId) {
  return conferenceData.scheduledSessions.filter(function(session) {
    return session.categoryId === categoryId;
  });
}


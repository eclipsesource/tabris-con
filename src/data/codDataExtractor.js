var conferenceData;
var sanitizeHtml = require("sanitize-html");
var moment = require("moment");

function prepare(data) {
  if (conferenceData) {
    return conferenceData;
  }
  conferenceData = JSON.parse(JSON.stringify(data));
  conferenceData.scheduledSessions.forEach(function(session) {
    session.categoryId = session.category.toUpperCase().replace(/ /g, "_");
    session.categoryName = session.category;
    delete session.category;
  });
  return conferenceData;
}

exports.extractPreviewCategories = function(conferenceData) {
  var previewCategories = [];
  var conferenceData = prepare(conferenceData);
  var categoriesList = getCategoriesList(conferenceData, {exclude: "SCHEDULE_ITEM"});
  categoriesList.forEach(function(category) {
    previewCategories.push(createCategory(conferenceData, category, {limit: 2}));
  });
  return previewCategories;
};

exports.extractCategory = function(conferenceData, tag) {
  // TODO
};

exports.extractSession = function(conferenceData, id) {
  // TODO
};

exports.extractBlocks = function(conferenceData) {
  // TODO
};

function createCategory(conferenceData, category, options) {
  return {
    id: category.id,
    title: category.name,
    sessions: getSessions(conferenceData, category.id, options ? options.limit : undefined)
  };
}

function getCategoriesList(conferenceData, options) {
  var categories = {};
  conferenceData.scheduledSessions.forEach(function(session) {
    categories[session.categoryId] = session.categoryName;
  });
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

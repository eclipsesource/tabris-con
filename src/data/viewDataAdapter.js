var _ = require("underscore");
var moment = require("moment-timezone");

var TIMEZONE = "America/Los_Angeles"; // TODO: retrieve timezone from device, see tabris-js#726

exports.adaptPreviewCategories = function(previewCategories) {
  var previewCategories = JSON.parse(JSON.stringify(previewCategories));
  var result = [];
  result.push({type: "separator"});
  previewCategories.forEach(function(categoryPreview) {
    result.push({type: "title", id: categoryPreview.id, title: categoryPreview.title});
    result = _.union(result, getCategoryPreviewSessions(categoryPreview));
    result.push({type: "spacer"});
    result.push({type: "separator"});
  });
  return result;
};

function getCategoryPreviewSessions(categoryPreview) {
  var sessions = [];
  categoryPreview.sessions.forEach(function(session) {
    sessions.push(adaptSessionListItem(session, {type: "session"}));
  });
  return sessions;
}

exports.adaptCategory = function(category) {
  var category = JSON.parse(JSON.stringify(category));
  var result = [];
  result.push({type: "spacer"});
  category.sessions.forEach(function(session) {
    var sessionListItem = adaptSessionListItem(session, {type: "categorySession"});
    result.push(sessionListItem);
  });
  result.push({type: "spacer"});
  return result;
};

exports.adaptSession = function(session) {
  var session = JSON.parse(JSON.stringify(session));
  var startDateString = moment(session.startTimestamp).tz(TIMEZONE).format("DD MMM YYYY, HH:MM");
  var endTimeString = moment(session.endTimestamp).tz(TIMEZONE).format("HH:MM");
  session.summary = startDateString + " - " + endTimeString + " in " + session.room;
  session.speakers.forEach(adaptSpeaker);
  delete session.startTimestamp;
  delete session.endTimestamp;
  delete session.room;
  return session;
};

function adaptSpeaker(speaker) {
  speaker.summary = createSpeakerSummary(speaker);
  speaker.image = speaker.image || "resources/images/speaker_avatar.png";
  speaker.bio = speaker.bio || "";
  delete speaker.name;
  delete speaker.company;
}

function createSpeakerSummary(speaker) {
  var companyPart = ", " + speaker.company;
  return speaker.name + (speaker.company ? companyPart : "");
}

function adaptSessionListItem(session, options) {
  session.timeframe = moment(session.startTimestamp).tz(TIMEZONE).format("D MMM - HH:MM") +
      " / " +
    moment(session.endTimestamp).tz(TIMEZONE).format("HH:MM");
  delete session.startTimestamp;
  delete session.endTimestamp;
  return _.extend({}, session, {type: options.type});
}

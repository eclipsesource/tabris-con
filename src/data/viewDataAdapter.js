var _ = require("underscore");
var moment = require("moment-timezone");
var config = require("../../config");

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
    sessions.push(adaptSessionListItem(session));
  });
  return sessions;
}

exports.adaptCategory = function(category) {
  var category = JSON.parse(JSON.stringify(category));
  var result = [];
  result.push({type: "spacer"});
  category.sessions.forEach(function(session) {
    var sessionListItem = adaptSessionListItem(session, {timeframeSummary: true});
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

exports.adaptBlocks = function(blocks) {
  var blocks = JSON.parse(JSON.stringify(blocks));
  var adaptedBlocks = [];
  var conferenceDates = calculateConferenceDates(blocks);
  conferenceDates.forEach(function(conferenceDate) {
    var date = moment({M: conferenceDate.month, d: conferenceDate.day});
    var filteredBlocks = filterBlocks(blocks, date);
    adaptedBlocks.push({day: date.format("DD MMM"), blocks: adaptBlocks(filteredBlocks)});
  });
  return adaptedBlocks;
};

function adaptSessionListItem(session, options) {
  var timeframeSummary = moment(session.startTimestamp).tz(TIMEZONE).format("D MMM - HH:MM") +
    " / " +
    moment(session.endTimestamp).tz(TIMEZONE).format("HH:MM");
  session.summary = options && options.timeframeSummary ? timeframeSummary : session.text;
  delete session.startTimestamp;
  delete session.endTimestamp;
  delete session.text;
  return _.extend({}, session, {type: "session"});
}

function calculateConferenceDates(blocks) {
  var conferenceDates = [];
  blocks.forEach(function(block) {
    conferenceDates.push({
      day: moment(block.startTimestamp).tz(TIMEZONE).get("date"),
      month: moment(block.startTimestamp).tz(TIMEZONE).get("month")
    });
  });
  return _.uniq(conferenceDates, function(date) {
    return JSON.stringify(date);
  });
}

function adaptBlocks(blocks) {
  var adaptedBlocks = [];
  blocks.forEach(function(block, index) {
    var startTime = moment(block.startTimestamp).tz(TIMEZONE);
    var endTime = moment(block.endTimestamp).tz(TIMEZONE);
    adaptedBlocks.push({
      type: "scheduleItem",
      startTime: startTime.format("HH:mm"),
      summary: startTime.format("HH:mm") + " - " + endTime.format("HH:mm") + " / " + block.room,
      title: block.title,
      image: getImageForBlockTitle(block.title)
    });
    if(index !== blocks.length-1) {
      adaptedBlocks.push({type: "smallSeparator"});
    }
  });
  return adaptedBlocks;
}

function getImageForBlockTitle(title) {
  var patternIconMap = config.SCHEDULE_PATTERN_ICON_MAP[config.DATA_FORMAT];
  return _.find(patternIconMap, function(icon, pattern) {
    if(title.match(pattern)) {
      return icon;
    }
  });
}

function filterBlocks(blocks, date) {
  return blocks.filter(function(block) {
    var blockDate = moment(block.startTimestamp).tz(TIMEZONE);
    var sameDay = blockDate.get("date") === date.get("date");
    var sameMonth = blockDate.get("month") === date.get("month");
    return sameDay && sameMonth;
  });
}

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

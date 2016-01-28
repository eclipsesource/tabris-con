var _ = require("underscore");
var moment = require("moment-timezone");
var utility = require("../util");
var config = require("../../config");

exports.adaptPreviewCategories = function(previewCategories) {
  var previewCategories = utility.deepClone(previewCategories);
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
  var category = utility.deepClone(category);
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
  var session = utility.deepClone(session);
  var startDateString = formatDate(session.startTimestamp, "DD MMM YYYY, HH:mm");
  var endTimeString = formatDate(session.endTimestamp, "HH:mm");
  session.summary = startDateString + " - " + endTimeString + " in " + session.room;
  session.speakers.forEach(adaptSpeaker);
  delete session.startTimestamp;
  delete session.endTimestamp;
  delete session.room;
  return session;
};

exports.adaptBlocks = function(appConfig, blocks) {
  var blocks = utility.deepClone(blocks);
  var adaptedBlocks = [];
  var conferenceDates = calculateConferenceDates(blocks);
  conferenceDates.forEach(function(conferenceDate) {
    var date = {M: conferenceDate.month, d: conferenceDate.day};
    var filteredBlocks = filterBlocks(blocks, date);
    adaptedBlocks.push({day: formatDate(date, ("DD MMM")), blocks: adaptBlocks(appConfig, filteredBlocks)});
  });
  return adaptedBlocks;
};

function adaptSessionListItem(session, options) {
  var timeframeSummary = formatDate(session.startTimestamp, "D MMM - HH:mm") +
    " / " +
    formatDate(session.endTimestamp, "HH:mm");
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
      day: getDay(block.startTimestamp),
      month: getMonth(block.startTimestamp)
    });
  });
  return _.uniq(conferenceDates, function(date) {
    return JSON.stringify(date);
  });
}

function adaptBlocks(appConfig, blocks) {
  var adaptedBlocks = [];
  blocks.forEach(function(block, index) {
    adaptedBlocks.push({
      type: "scheduleItem",
      startTime: formatDate(block.startTimestamp, "HH:mm"),
      summary: formatDate(block.startTimestamp, "HH:mm") + " - " + formatDate(block.endTimestamp, "HH:mm") + " / " + block.room,
      title: block.title,
      image: getImageForBlockTitle(appConfig, block.title)
    });
    if(index !== blocks.length-1) {
      adaptedBlocks.push({type: "smallSeparator"});
    }
  });
  return adaptedBlocks;
}

function getImageForBlockTitle(appConfig, title) {
  var patternIconMap = appConfig.SCHEDULE_PATTERN_ICON_MAP[appConfig.DATA_FORMAT];
  return _.find(patternIconMap, function(icon, pattern) {
    if(title.match(pattern)) {
      return icon;
    }
  });
}

function filterBlocks(blocks, date) {
  return blocks.filter(function(block) {
    var sameDay = getDay(block.startTimestamp) === date.d;
    var sameMonth = getMonth(block.startTimestamp) === date.M;
    return sameDay && sameMonth;
  });
}

function adaptSpeaker(speaker) {
  speaker.summary = createSpeakerSummary(speaker);
  speaker.image = speaker.image || "speaker_avatar";
  speaker.bio = speaker.bio || "";
  delete speaker.name;
  delete speaker.company;
}

function createSpeakerSummary(speaker) {
  var companyPart = ", " + speaker.company;
  return speaker.name + (speaker.company ? companyPart : "");
}

function formatDate(timestamp, format) {
  return moment(timestamp).tz(config.CONFERENCE_TIMEZONE).format(format);
}

function getDay(timestamp) {
  return moment(timestamp).tz(config.CONFERENCE_TIMEZONE).get("date");
}

function getMonth(timestamp) {
  return moment(timestamp).tz(config.CONFERENCE_TIMEZONE).get("month");
}

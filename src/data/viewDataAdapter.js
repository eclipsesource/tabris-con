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
    result = _.union(result, categoryPreview.sessions.map(function(session) {
      return adaptSessionListItem(session);
    }));
    result.push({type: "spacer"});
    result.push({type: "separator"});
  });
  return result;
};

exports.adaptCategory = function(category) {
  var category = utility.deepClone(category);
  var result = [];
  result.push({type: "spacer"});
  result = _.union(result, category.sessions.map(function(session) {
    return adaptSessionListItem(session, {timeframeSummary: true});
  }));
  result.push({type: "spacer"});
  return result;
};

exports.adaptSession = function(session) {
  var startDateString = formatDate(session.startTimestamp, "DD MMM YYYY, HH:mm");
  var endTimeString = formatDate(session.endTimestamp, "HH:mm");
  return {
    summary: startDateString + " - " + endTimeString + " in " + session.room,
    description: session.description,
    title: session.title,
    image: session.image,
    speakers: session.speakers.map(function(speaker) {
      return {
        summary: createSpeakerSummary(speaker),
        image: speaker.image || "speaker_avatar",
        bio: speaker.bio || ""
      };
    })
  };
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
  return {
    summary: options && options.timeframeSummary ? timeframeSummary : session.text,
    type: "session",
    id: session.id,
    image: session.image,
    title: session.title
  };
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

var _ = require("lodash");
var moment = require("moment-timezone");
var config = require("../../config");
var FreeBlockInsertor = require("./FreeBlockInsertor");

exports.adaptPreviewCategories = function(previewCategories) {
  var previewCategories = _.cloneDeep(previewCategories);
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
  var category = _.cloneDeep(category);
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
    id: session.id,
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
  var blocks = new FreeBlockInsertor(appConfig).insertIn(blocks);
  return _(blocks)
    .sortBy(function(block) {
      return block.startTimestamp;
    })
    .groupBy(function(block) {
      return formatDate(block.startTimestamp, "DD MMM");
    })
    .map(function(datedBlocks) {
      return mapDatedBlock(appConfig, datedBlocks);
    })
    .value();
};

function mapDatedBlock(appConfig, datedBlocks) {
  var separators = createSeparators(datedBlocks);
  return {
    day: formatDate(datedBlocks[0].startTimestamp, "DD MMM"),
    blocks: _(datedBlocks)
      .map(function(datedBlock) {
        return adaptDatedBlock(appConfig, datedBlock);
      })
      .sortBy("startTime")
      .map(function(block, i) {return [block, separators[i]];})
      .flatten()
      .pull(undefined)
      .value()
  };
}

function adaptDatedBlock(appConfig, datedBlock) {
  var block = {
    image: getImageForBlockTitle(appConfig, datedBlock.title),
    summary: formatDate(datedBlock.startTimestamp, "HH:mm") + " - " +
      formatDate(datedBlock.endTimestamp, "HH:mm") + " / " + datedBlock.room,
    startTime: formatDate(datedBlock.startTimestamp, "HH:mm"),
    startTimestamp: datedBlock.startTimestamp,
    endTimestamp: datedBlock.endTimestamp,
    sessionType: datedBlock.sessionType || "session",
    title: datedBlock.title,
    type: "block"
  };
  if (datedBlock.sessionId) {
    block.sessionId = datedBlock.sessionId;
  }
  return block;
}

function createSeparators(blocks) {
  var separators = [];
  _.times(blocks.length - 1, function() {
    separators.push({type: "smallSeparator"});
  });
  return separators;
}

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

function getImageForBlockTitle(appConfig, title) {
  var patternIconMap = appConfig.SCHEDULE_PATTERN_ICON_MAP[appConfig.DATA_FORMAT];
  return _.find(patternIconMap, function(icon, pattern) {
    if (title.match(pattern)) {
      return icon;
    }
  });
}

function createSpeakerSummary(speaker) {
  var companyPart = ", " + speaker.company;
  return speaker.name + (speaker.company ? companyPart : "");
}

function formatDate(timestamp, format) {
  return moment.tz(timestamp, config.CONFERENCE_TIMEZONE).format(format);
}

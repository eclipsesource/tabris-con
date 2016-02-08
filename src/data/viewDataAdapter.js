var _ = require("lodash");
var TimezonedDate = require("../TimezonedDate");
var freeBlockInsertor = require("./freeBlockInsertor");
var config = require("../../config");

exports.adaptPreviewCategories = function(previewCategories) {
  var previewCategories = _.cloneDeep(previewCategories);
  previewCategories = _.sortBy(previewCategories, "title");
  var result = [];
  result.push({type: "groupSeparator"});
  previewCategories.forEach(function(categoryPreview) {
    result.push({type: "title", id: categoryPreview.id, title: categoryPreview.title});
    result = _.union(result, categoryPreview.sessions.map(function(session) {
      return adaptSessionListItem(session, "previewSession");
    }));
    result.push({type: "previewCategoriesSpacer"});
    result.push({type: "groupSeparator"});
  });
  return result;
};

exports.adaptCategory = function(category) {
  var separators = createSeparators(category.sessions.length, "iOSLineSeparator");
  var result = [];
  result = _(result)
    .union(category.sessions.map(function(session) {
      return adaptSessionListItem(session, "session", {timeframeSummary: true});
    }))
    .sortBy("startTime")
    .map(function(block, i) {return [block, separators[i]];})
    .flatten()
    .pull(undefined)
    .value();
  result.unshift({type: "sessionsSpacer"});
  result.push({type: "sessionsSpacer"});
  return result;
};

exports.adaptSession = function(session) {
  var startDateString = new TimezonedDate(session.startTimestamp).format("DD MMM YYYY, HH:mm");
  var endTimeString = new TimezonedDate(session.endTimestamp).format("HH:mm");
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

exports.adaptBlocks = function(blocks) {
  var blocks = freeBlockInsertor.insertIn(blocks);
  return _(blocks)
    .sortBy(function(block) {
      return block.startTimestamp;
    })
    .groupBy(function(block) {
      return new TimezonedDate(block.startTimestamp).format("DD MMM");
    })
    .map(function(datedBlocks) {
      return mapDatedBlock(datedBlocks);
    })
    .value();
};

function mapDatedBlock(datedBlocks) {
  var separators = createSeparators(datedBlocks.length, "smallSeparator");
  return {
    day: new TimezonedDate(datedBlocks[0].startTimestamp).format("DD MMM"),
    blocks: _(datedBlocks)
      .map(function(datedBlock) {
        return adaptDatedBlock(datedBlock);
      })
      .sortBy("startTime")
      .map(function(block, i) {return [block, separators[i]];})
      .flatten()
      .pull(undefined)
      .value()
  };
}

function adaptDatedBlock(datedBlock) {
  var block = {
    image: getImageForBlockTitle(datedBlock.title),
    summary: new TimezonedDate(datedBlock.startTimestamp).format("HH:mm") + " - " +
      new TimezonedDate(datedBlock.endTimestamp).format("HH:mm") + " / " + datedBlock.room,
    startTime: new TimezonedDate(datedBlock.startTimestamp).format("HH:mm"),
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

function createSeparators(itemCount, type) {
  var separators = [];
  _.times(itemCount - 1, function() {
    separators.push({type: type});
  });
  return separators;
}

function adaptSessionListItem(session, type, options) {
  var timeframeSummary = new TimezonedDate(session.startTimestamp).format("D MMM - HH:mm") +
    " / " +
    new TimezonedDate(session.endTimestamp).format("HH:mm");
  return {
    startTimestamp: session.startTimestamp,
    summary: options && options.timeframeSummary ? timeframeSummary : session.text,
    type: type,
    id: session.id,
    image: session.image,
    title: session.title
  };
}

function getImageForBlockTitle(title) {
  var patternIconMap = config.SCHEDULE_PATTERN_ICON_MAP[config.DATA_FORMAT];
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

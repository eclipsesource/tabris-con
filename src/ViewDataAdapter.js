import _ from "lodash";
import TimezonedDate from "./TimezonedDate";
import FreeBlockInsertor from "./FreeBlockInsertor";

export default class {
  constructor(config, loginService, feedbackService) {
    this._config = config;
    this._loginService = loginService;
    this._feedbackService = feedbackService;
    this._timezone = this._config.CONFERENCE_TIMEZONE;
  }

  adaptPreviewCategories(categories) {
    let previewCategories = _.cloneDeep(categories);
    previewCategories = _.sortBy(previewCategories, "title");
    this._moveKeynotesToFirstPosition(previewCategories);
    let result = [];
    result.push({type: "groupSeparator"});
    previewCategories.forEach(categoryPreview => {
      result.push({
        type: categoryPreview.id === "KEYNOTES" ? "keynoteTitle" : "title",
        id: categoryPreview.id,
        title: categoryPreview.title
      });
      result = _.union(result, categoryPreview.sessions.map(
        session => this._adaptSessionListItem(session, "previewSession", {summaryType: "previewText"}))
      );
      result.push({type: "previewCategoriesSpacer"});
      result.push({type: "groupSeparator"});
    });
    return result;
  }

  adaptCategory(category) {
    return this._adaptList("session", category.sessions, {summaryType: "timeframe"});
  }

  adaptTimeframe(category) {
    return this._adaptList("session", category.sessions, {summaryType: "category"});
  }

  adaptSession(session) {
    let startDateString = [
      new TimezonedDate(this._timezone, session.startTimestamp).format("ll"),
      new TimezonedDate(this._timezone, session.startTimestamp).format("LT")
    ].join(", ");
    let endTimeString = new TimezonedDate(this._timezone, session.endTimestamp).format("LT");
    let adaptedSession = {
      id: session.id,
      summary: startDateString + " - " + endTimeString + " in " + session.room,
      startTimestamp: session.startTimestamp,
      endTimestamp: session.endTimestamp,
      description: session.description,
      title: session.title,
      image: session.image,
      categoryName: session.categoryName,
      speakers: session.speakers.map(
        speaker => ({
          summary: this._createSpeakerSummary(speaker),
          image: speaker.image || "speaker_avatar",
          bio: speaker.bio || ""
        })
      )
    };
    if (session.nid) {
      adaptedSession.nid = session.nid;
    }
    return adaptedSession;
  }

  adaptKeynote(keynote) {
    return this.adaptSession(keynote);
  }

  adaptBlocks(blocks) {
    let freeBlockInsertor = new FreeBlockInsertor(this._config);
    let blocksAndFreeBlocks = freeBlockInsertor.insert(blocks);
    return _(blocksAndFreeBlocks)
      .sortBy("startTimestamp")
      .groupBy(block => new TimezonedDate(this._timezone, block.startTimestamp).format("DD MMM"))
      .map(datedBlocks => this._mapDatedBlock(datedBlocks))
      .value();
  }

  _moveKeynotesToFirstPosition(previewCategories) {
    let keynote = _.find(previewCategories, category => category.id === "KEYNOTES");
    if (keynote) {
      previewCategories.splice(previewCategories.indexOf(keynote), 1);
      previewCategories.unshift(keynote);
    }
  }

  _adaptList(itemType, dataList, options) {
    let separators = this._createSeparators(dataList.length, "iOSLineSeparator");
    let result = [];
    result = _(result)
      .union(
        dataList.map(
          session => this._adaptSessionListItem(session, itemType, {summaryType: options.summaryType})
        )
      )
      .sortBy("startTimestamp")
      .map((block, i) => [block, separators[i]])
      .flatten()
      .pull(undefined)
      .value();
    result.unshift({type: "sessionsSpacer"});
    result.push({type: "sessionsSpacer"});
    return result;
  }

  _mapDatedBlock(datedBlocks) {
    let separators = this._createSeparators(datedBlocks.length, "smallSeparator");
    return {
      day: new TimezonedDate(this._timezone, datedBlocks[0].startTimestamp).format("DD MMM"),
      blocks: _(datedBlocks)
        .sortBy("startTimestamp")
        .map(this._getDatedBlockAdapter())
        .map((block, i) => [block, separators[i]])
        .flatten()
        .pull(undefined)
        .value()
    };
  }

  _getDatedBlockAdapter() {
    return (datedBlock) => {
      let block = {
        image: this._getImageForBlockTitle(datedBlock.title),
        summary: this._getBlockSummary(datedBlock),
        startTime: new TimezonedDate(this._timezone, datedBlock.startTimestamp).format("LT"),
        startTimestamp: datedBlock.startTimestamp,
        endTimestamp: datedBlock.endTimestamp,
        feedbackIndicatorState: this._getFeedbackIndicatorState(datedBlock),
        sessionType: datedBlock.sessionType || "session",
        title: datedBlock.title,
        type: "block"
      };
      if (typeof datedBlock.keynote !== "undefined") {
        block.keynote = datedBlock.keynote;
      }
      if (datedBlock.sessionId) {
        block.sessionId = datedBlock.sessionId;
      }
      if (datedBlock.sessionNid) {
        block.sessionNid = datedBlock.sessionNid;
      }
      return block;
    };
  }

  _getBlockSummary(datedBlock) {
    let summaryArray = [
      [
        new TimezonedDate(this._timezone, datedBlock.startTimestamp).format("LT"),
        new TimezonedDate(this._timezone, datedBlock.endTimestamp).format("LT")
      ].join(" - ")
    ];
    if (datedBlock.room) {
      summaryArray.push(datedBlock.room);
    }
    return summaryArray.join(" / ");
  }

  _getFeedbackIndicatorState(session) {
    if (session.sessionNid) {
      return this._feedbackService.canGiveFeedbackForSession(session) &&
        this._loginService.isLoggedIn() ? "loading" : null;
    }
    return null;
  }

  _createSeparators(itemCount, type) {
    let separators = [];
    _.times(itemCount - 1,() => {
      separators.push({type: type});
    });
    return separators;
  }

  _adaptSessionListItem(session, type, options) {
    let self = this;
    return {
      startTimestamp: session.startTimestamp,
      summary: self._getSummary(session, options.summaryType),
      keynote: session.keynote,
      type: type,
      id: session.id,
      image: session.image,
      title: session.title,
      categoryName: session.categoryName
    };
  }

  _getSummary(session, summaryType) {
    let typeData = {
      timeframe: [
        new TimezonedDate(this._timezone, session.startTimestamp).format("D MMM"), this._getTimeframeTimePart(session)
      ].join(" - "),
      previewText: session.description,
      category: session.categoryName
    };
    return typeData[summaryType];
  }

  _getTimeframeTimePart(session) {
    return [
      new TimezonedDate(this._timezone, session.startTimestamp).format("LT"),
      new TimezonedDate(this._timezone, session.endTimestamp).format("LT")
    ].join(" / ");
  }

  _getImageForBlockTitle(title) {
    let patternIconMap = this._config.SCHEDULE_PATTERN_ICON_MAP;
    return _.find(patternIconMap,(icon, pattern) => {
      if (title.match(pattern)) {
        return icon;
      }
    });
  }

  _createSpeakerSummary(speaker) {
    let companyPart = ", " + speaker.company;
    return speaker.name + (speaker.company ? companyPart : "");
  }
}

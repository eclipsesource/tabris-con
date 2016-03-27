import sanitizeHtml from "sanitize-html";
import _ from "lodash";
import squash from "./squash";
import TimezonedDate from "./TimezonedDate";

_.mixin({squash});

export default class {
  constructor(conferenceData, config) {
    this._config = config;
    this._timezone = this._config.CONFERENCE_TIMEZONE;
    this._conferenceData = _.cloneDeep(conferenceData);
    this._aggregateSessionRooms(this._conferenceData);
    this._removeIgnoredBlocks(this._conferenceData);
    this._assignCategoryTypes(this._conferenceData);
  }

  extractPreviewCategories() {
    let keynoteCategory = {
      id: "KEYNOTES",
      title: "Keynotes",
      sessions: this.extractKeynotes().map(keynote => ({
        id: keynote.id,
        title: keynote.title,
        text: stripHtml(keynote.description),
        categoryName: keynote.categoryName || null,
        startTimestamp: new TimezonedDate(this._timezone, keynote.startTimestamp).toJSON(),
        endTimestamp: new TimezonedDate(this._timezone, keynote.endTimestamp).toJSON()
      }))
    };
    let previewCategories = this._getCategoriesList({exclude: "SCHEDULE_ITEM"})
      .map(category => this._createCategory(category.id, {limit: 2}));
    previewCategories.push(keynoteCategory);
    return previewCategories;
  }

  extractCategories() {
    return _(this._getCategoriesList())
      .filter(category => category.id !== "SCHEDULE_ITEM")
      .map(category => this._createCategory(category.id))
      .value();
  }

  extractKeynotes() {
    return this._getMappedSessions(session => session.session_type === "Keynote");
  }

  extractSessions() {
    return this._getMappedSessions(session => session.type !== "schedule_item");
  }

  extractBlocks() {
    return _(this._conferenceData.scheduledSessions)
      .filter(codSession => codSession.type === "schedule_item")
      .groupBy(item => item.title + "#" + item.start + "#" + item.end)
      .map(group => ({
        title: group[0].title,
        startTimestamp: new TimezonedDate(this._timezone, group[0].start).toJSON(),
        endTimestamp: new TimezonedDate(this._timezone, group[0].end).toJSON(),
        room: _.map(group, "room").join(", ")
      }))
      .value();
  }

  _getMappedSessions(predicate) {
    return this._conferenceData.scheduledSessions
      .filter(predicate)
      .map(session => ({
        id: session.id,
        nid: session.nid,
        title: session.title,
        description: stripHtml(session.abstract),
        room: session.room,
        categoryName: session.categoryName || null,
        startTimestamp: new TimezonedDate(this._timezone, session.start).toJSON(),
        endTimestamp: new TimezonedDate(this._timezone, session.end).toJSON(),
        speakers: session.presenter.map(speaker => ({
          name: speaker.fullname,
          bio: stripHtml(speaker.bio),
          company: speaker.organization,
          image: speaker.picture
        }))
      }));
  }

  _createCategory(categoryId, options) {
    return {
      id: categoryId,
      title: this._getCategoryName(categoryId),
      sessions: this._getSessions(categoryId, options ? options.limit : undefined)
    };
  }

  _getCategoryName(categoryId) {
    let session = _.find(this._conferenceData.scheduledSessions, session => session.categoryId === categoryId);
    return session && session.categoryName ? session.categoryName : null;
  }

  _getCategoriesList(options) {
    let catList = _(this._conferenceData.scheduledSessions)
      .filter(session => options && options.exclude ? options.exclude !== session.categoryId : true)
      .map(session => ({id: session.categoryId, name: session.categoryName}))
      .uniqWith(_.isEqual)
      .value();
    return catList;
  }

  _getSessions(value, limit) {
    return _(this._conferenceData.scheduledSessions)
      .filter(session => session.categoryId === value)
      .slice(0, limit)
      .map(session => ({
        id: session.id,
        title: session.title,
        text: stripHtml(session.abstract),
        categoryName: session.categoryName || null,
        startTimestamp: new TimezonedDate(this._timezone, session.start).toJSON(),
        endTimestamp: new TimezonedDate(this._timezone, session.end).toJSON()
      }))
      .value();
  }

  _removeIgnoredBlocks(conferenceData) {
    conferenceData.scheduledSessions = _.reject(
      conferenceData.scheduledSessions,
      session => session.type === "schedule_item" && !!session.title.match(this._config.IGNORED_COD_BLOCKS)
    );
  }

  _assignCategoryTypes(conferenceData) {
    conferenceData.scheduledSessions.forEach(session => {
      session.categoryId = session.category.toUpperCase().replace(/ /g, "_");
      session.categoryName = session.category || null;
      delete session.category;
    });
    return conferenceData;
  }

  _aggregateSessionRooms(conferenceData) {
    conferenceData.scheduledSessions = _(conferenceData.scheduledSessions)
      .squash(session => session.type === "schedule_item" ? _.uniqueId() : session.title, {
        aggregatee: "room", separator: ", "
      })
      .value();
  }
}

function stripHtml(hypertext) {
  return sanitizeHtml(hypertext, {allowedTags: [], allowedAttributes: []});
}


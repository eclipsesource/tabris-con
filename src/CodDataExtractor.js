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
        categoryId: session.categoryId || null,
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

  _removeIgnoredBlocks(conferenceData) {
    conferenceData.scheduledSessions = _.reject(
      conferenceData.scheduledSessions,
      session => session.type === "schedule_item" && !!session.title.match(this._config.IGNORED_BLOCK_PATTERN)
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

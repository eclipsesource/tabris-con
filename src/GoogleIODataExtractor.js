let PREVIEW_CATEGORIES = ["TOPIC", "THEME"];
import _ from "lodash";

export default class {
  constructor(conferenceData) {
    this._conferenceData = conferenceData;
  }

  extractPreviewCategories() {
    let previewCategories = this._getTagsForCategories(PREVIEW_CATEGORIES)
      .map(tagToPreview => this._createCategory(tagToPreview, {sessionsLimit: 2}));
    let keynotes = {
      id: "KEYNOTES",
      title: "Keynotes",
      sessions: this.extractKeynotes().map(keynote => ({
        id: keynote.id,
        title: keynote.title,
        image: keynote.image,
        text: keynote.description,
        startTimestamp: keynote.startTimestamp,
        endTimestamp: keynote.endTimestamp,
        categoryId: keynote.mainTag || null,
        categoryName: this._getTagName(keynote.mainTag)
      }))
    };
    previewCategories.push(keynotes);
    return previewCategories;
  }

  extractKeynotes() {
    return this._conferenceData.keynote.sessions.map(this._getSessionMapper());
  }

  extractSessions() {
    return this._conferenceData.sessionData.sessions.map(this._getSessionMapper());
  }

  extractBlocks() {
    return this._conferenceData.blocks.blocks
      .filter(googleIOBlock => googleIOBlock.type !== "free")
      .map(googleIOBlock => ({
        title: googleIOBlock.title,
        room: googleIOBlock.subtitle,
        startTimestamp: googleIOBlock.start,
        endTimestamp: googleIOBlock.end
      }));
  }

  _getSessionMapper() {
    return googleIOSession => ({
      id: googleIOSession.id,
      title: googleIOSession.title,
      description: googleIOSession.description,
      room: this._getGoogleIOSessionRoom(googleIOSession),
      image: googleIOSession.photoUrl,
      startTimestamp: googleIOSession.startTimestamp,
      endTimestamp: googleIOSession.endTimestamp,
      speakers: this._findSpeakers(googleIOSession.speakers),
      categoryId: googleIOSession.mainTag || null,
      categoryName: this._getTagName(googleIOSession.mainTag)
    });
  }

  _findSpeakers(googleIOSessionSpeakers) {
    return this._conferenceData.sessionData.speakers
      .filter(speaker => googleIOSessionSpeakers.indexOf(speaker.id) > -1)
      .map(googleIOSpeaker => ({
        name: googleIOSpeaker.name,
        bio: googleIOSpeaker.bio || null,
        image: googleIOSpeaker.thumbnailUrl || null,
        company: googleIOSpeaker.company || null
      }));
  }

  _getTagsForCategories(categories) {
    return _(this._conferenceData.sessionData.tags)
      .filter(tag => categories.indexOf(tag.category) > -1)
      .map("tag").value();
  }

  _getGoogleIOSessionRoom(googleIOSession) {
    return _(this._conferenceData.sessionData.rooms)
      .find(room => room.id === googleIOSession.room).name;
  }

  _createCategory(tag, filter) {
    let self = this;
    return {
      id: tag,
      title: self._getTagName(tag),
      sessions: self._getSessions(tag, filter ? filter.sessionsLimit : undefined)
    };
  }

  _getTagName(tag) {
    let tagObject = _.find(this._conferenceData.sessionData.tags, tagObject => tagObject.tag === tag);
    return tagObject && tagObject.name || null;
  }

  _getSessions(tag, limit) {
    return this._conferenceData.sessionData.sessions
      .filter(session => session.tags.indexOf(tag) > -1)
      .slice(0, limit)
      .map(session => ({
        id: session.id,
        title: session.title,
        image: session.photoUrl,
        text: session.description,
        startTimestamp: session.startTimestamp,
        endTimestamp: session.endTimestamp,
        categoryName: this._getTagName(session.mainTag)
      }));
  }
}


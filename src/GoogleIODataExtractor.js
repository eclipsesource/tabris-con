import _ from "lodash";

export default class {
  constructor(conferenceData) {
    this._conferenceData = conferenceData;
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

  _getGoogleIOSessionRoom(googleIOSession) {
    return _(this._conferenceData.sessionData.rooms)
      .find(room => room.id === googleIOSession.room).name;
  }

  _getTagName(tag) {
    let tagObject = _.find(this._conferenceData.sessionData.tags, tagObject => tagObject.tag === tag);
    return tagObject && tagObject.name || null;
  }

}

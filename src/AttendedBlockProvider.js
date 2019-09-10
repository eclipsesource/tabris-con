import * as persistedStorage from "./persistedStorage";
import ConferenceDataProvider from "./ConferenceDataProvider";
import {resolve, shared} from "tabris-decorators";

@shared export default class AttendedBlockProvider {
  constructor() {
    this._conferenceDataProvider = resolve(ConferenceDataProvider);
  }

  getBlocks() {
    return this._conferenceDataProvider.get().then(data => {
      let attendedBlockIds = persistedStorage.getAttendedSessions();
      return [...data.sessions, ...data.keynotes]
        .filter(session => attendedBlockIds.indexOf(session.id) > -1)
        .map(session => {
          let attendedBlock = {
            sessionId: session.id,
            sessionNid: session.nid,
            keynote: session.keynote,
            concurrentSessions: session.concurrentSessions,
            title: session.title,
            room: session.room,
            startTimestamp: session.startTimestamp,
            endTimestamp: session.endTimestamp
          };
          if (session.nid) {
            attendedBlock.sessionNid = session.nid;
          }
          return attendedBlock;
        });
    });
  }
}

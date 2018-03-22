import * as persistedStorage from "../persistedStorage";

export function addAttendedSessionId(sessionId) {
  persistedStorage.addAttendedSessionId(sessionId);
  tabris.ui.find("#schedule").first().initializeItems();
}

export function removeAttendedSessionId(sessionId) {
  persistedStorage.removeAttendedSessionId(sessionId);
  tabris.ui.find("#schedule").first().initializeItems();
}

export function isAttending(sessionId) {
  return persistedStorage.getAttendedSessions().indexOf(sessionId) > -1;
}

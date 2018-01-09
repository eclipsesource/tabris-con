import * as persistedStorage from "../persistedStorage";

export function addAttendedSessionId(sessionId, {focus = true} = {}) {
  persistedStorage.addAttendedSessionId(sessionId);
  updateSchedule(sessionId, focus);
}

export function removeAttendedSessionId(sessionId) {
  persistedStorage.removeAttendedSessionId(sessionId);
  updateSchedule();
}

export function isAttending(sessionId) {
  return persistedStorage.getAttendedSessions().indexOf(sessionId) > -1;
}

function updateSchedule(sessionId, focus) {
  let schedule = tabris.ui.find("#schedule").first();
  if (focus) {
    schedule.set("focus", sessionId);
  }
  schedule.initializeItems();
}

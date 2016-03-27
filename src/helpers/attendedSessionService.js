import * as persistedStorage from "../persistedStorage";

export function addAttendedSessionId(sessionId) {
  persistedStorage.addAttendedSessionId(sessionId);
  updateScheduleNavigatable(sessionId);
}

export function removeAttendedSessionId(sessionId) {
  persistedStorage.removeAttendedSessionId(sessionId);
  updateScheduleNavigatable();
}

export function isAttending(sessionId) {
  return persistedStorage.getAttendedSessions().indexOf(sessionId) > -1;
}

function updateScheduleNavigatable(sessionId) {
  let scheduleNavigatable = tabris.ui.find("#schedule").first();
  scheduleNavigatable.set("focus", sessionId);
  scheduleNavigatable.initializeItems();
}

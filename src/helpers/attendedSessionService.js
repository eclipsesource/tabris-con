import * as persistedStorage from "../persistedStorage";

export function addAttendedSessionId(sessionId, {focus = true} = {}) {
  persistedStorage.addAttendedSessionId(sessionId);
  updateScheduleNavigatable(sessionId, focus);
}

export function removeAttendedSessionId(sessionId) {
  persistedStorage.removeAttendedSessionId(sessionId);
  updateScheduleNavigatable();
}

export function isAttending(sessionId) {
  return persistedStorage.getAttendedSessions().indexOf(sessionId) > -1;
}

function updateScheduleNavigatable(sessionId, focus) {
  let scheduleNavigatable = tabris.ui.find("#schedule").first();
  if (focus) {
    scheduleNavigatable.set("focus", sessionId);
  }
  scheduleNavigatable.initializeItems();
}

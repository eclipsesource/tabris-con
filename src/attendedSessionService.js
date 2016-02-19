var persistedStorage = require("./data/persistedStorage");

exports.addAttendedSessionId = function(sessionId) {
  persistedStorage.addAttendedSessionId(sessionId);
  updateScheduleNavigatable(sessionId);
};

exports.removeAttendedSessionId = function(sessionId) {
  persistedStorage.removeAttendedSessionId(sessionId);
  updateScheduleNavigatable();
};

exports.isAttending = function(sessionId) {
  return persistedStorage.getAttendedSessions().indexOf(sessionId) > -1;
};

function updateScheduleNavigatable(sessionId) {
  var scheduleNavigatable = tabris.ui.find("#schedule").first();
  scheduleNavigatable.set("focus", sessionId);
  scheduleNavigatable.initializeItems();
}

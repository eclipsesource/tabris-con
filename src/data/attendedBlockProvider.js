var conferenceDataProvider = require("./conferenceDataProvider");
var persistedStorage = require("./persistedStorage");

exports.getBlocks = function() {
  var sessions = conferenceDataProvider.get().sessions;
  var attendedBlockIds = persistedStorage.getAttendedSessions();
  return sessions
    .filter(function(session) {
      return attendedBlockIds.indexOf(session.id) > -1;
    })
    .map(function(session) {
      var attendedBlock = {
        sessionId: session.id,
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
};

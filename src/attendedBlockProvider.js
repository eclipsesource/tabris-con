var conferenceDataProvider = require("./conferenceDataProvider");
var persistedStorage = require("./persistedStorage");

exports.getBlocks = function() {
  return conferenceDataProvider.get().then(function(data) {
    var attendedBlockIds = persistedStorage.getAttendedSessions();
    return data.sessions
      .filter(function(session) {
        return attendedBlockIds.indexOf(session.id) > -1;
      })
      .map(function(session) {
        var attendedBlock = {
          sessionId: session.id,
          sessionNid: session.nid,
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
};

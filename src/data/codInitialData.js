exports.get = function() {
  return {
    scheduledSessions: require("../../resources/data/cod/scheduled_sessions.json")
  };
};

var scheduledSessions = require("../../resources/data/cod/scheduled_sessions.json");

exports.load = function() {
  return {
    scheduledSessions: scheduledSessions
  };
};

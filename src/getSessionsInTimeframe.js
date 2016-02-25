var conferenceDataProvider = require("./data/conferenceDataProvider");
var TimezonedDate = require("./TimezonedDate");
var _ = require("lodash");

module.exports = function(timestamp1, timestamp2) {
  return conferenceDataProvider.get().then(function(data) {
    return _(data.sessions)
      .sortBy("startTimestamp")
      .filter(function(session) {
        return new TimezonedDate(timestamp1).toJSON() <= new TimezonedDate(session.startTimestamp).toJSON() &&
               new TimezonedDate(timestamp2).toJSON() > new TimezonedDate(session.startTimestamp).toJSON();
      }).value();
  });
};

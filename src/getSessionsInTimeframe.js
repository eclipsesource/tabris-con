import TimezonedDate from "./TimezonedDate";
import _ from "lodash";
import config from "./config";

export default function(conferenceDataProvider, timestamp1, timestamp2) {
  return conferenceDataProvider.get().then(function(data) {
    return _(data.sessions)
      .sortBy("startTimestamp")
      .filter(session => {
        return new TimezonedDate(config.CONFERENCE_TIMEZONE, timestamp1).toJSON() <=
                  new TimezonedDate(config.CONFERENCE_TIMEZONE, session.startTimestamp).toJSON() &&
               new TimezonedDate(config.CONFERENCE_TIMEZONE, timestamp2).toJSON() >
                  new TimezonedDate(config.CONFERENCE_TIMEZONE, session.startTimestamp).toJSON();
      }).value();
  });
}

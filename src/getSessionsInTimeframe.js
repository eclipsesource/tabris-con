import TimezonedDate from "./TimezonedDate";
import _ from "lodash";
import config from "./configs/config";

export default function(conferenceData, timestamp1, timestamp2) {
  return _([...conferenceData.sessions, ...conferenceData.keynotes])
    .sortBy("startTimestamp")
    .filter(session => {
      return new TimezonedDate(config.CONFERENCE_TIMEZONE, timestamp1).toJSON() <=
                new TimezonedDate(config.CONFERENCE_TIMEZONE, session.startTimestamp).toJSON() &&
              new TimezonedDate(config.CONFERENCE_TIMEZONE, timestamp2).toJSON() >
                new TimezonedDate(config.CONFERENCE_TIMEZONE, session.startTimestamp).toJSON();
    }).value();
}

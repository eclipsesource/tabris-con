import TimezonedDate from "./TimezonedDate";

export default class extends TimezonedDate {
  constructor(config, date) {
    super(config.CONFERENCE_TIMEZONE, date, "DD.MM.YYYY HH:mm");
  }
  toJSDate() {
    return new Date(this.toJSON());
  }
}

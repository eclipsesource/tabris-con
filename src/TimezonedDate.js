import moment from "moment-timezone";

export default class TimezonedDate {
  constructor(timezone, date, format) {
    let args = [];
    args.push(date);
    if (format) {
      args.push(format);
    }
    args.push(timezone);
    this._momentDate = moment.tz.apply(this, args);
  }

  format(format) {
    return this._momentDate.format(format);
  }

  toJSON() {
    return this._momentDate.toJSON();
  }
}

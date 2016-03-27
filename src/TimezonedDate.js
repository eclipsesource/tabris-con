import moment from "moment-timezone";

export default class {
  constructor(timezone, date) {
    let args = [date, timezone];
    this._momentDate = moment.tz.apply(this, args);
  }

  format(format) {
    return this._momentDate.format(format);
  }

  toJSON() {
    return this._momentDate.toJSON();
  }
}

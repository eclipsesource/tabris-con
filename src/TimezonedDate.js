var moment = require("moment-timezone");
var config = require("../config");

module.exports = function(date, format) {
  var args = [date];
  if (format) {
    args.push(format);
  }
  args.push(config.CONFERENCE_TIMEZONE || "America/Los_Angeles");
  var momentDate = moment.tz.apply(this, args);

  this.format = function(format) {
    return momentDate.format(format);
  };

  this.setTimezone = function(timezone) {
    momentDate = moment.tz(date, format, timezone);
    return this;
  };

  this.toJSON = function() {
    return momentDate.toJSON();
  };
};

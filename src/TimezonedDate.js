var config = require("../config");

module.exports = function(date, format) {
  var moment = moment.tz(date, format, config.CONFERENCE_TIMEZONE);

  this.format = function(format) {
    return moment.format(format);
  };

  this.toString = function() {
    return
  };
}

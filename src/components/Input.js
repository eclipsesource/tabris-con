var applyPlatformStyle = require("../helpers/applyPlatformStyle");
var _ = require("lodash");

exports.create = function(configuration) {
  var input = new tabris.TextInput(_.extend({
    class: "input"
  }, configuration));
  applyPlatformStyle(input);
  applyPlatformStyle(input);
  return input;
};

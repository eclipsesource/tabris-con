var applyPlatformStyle = require("../helpers/applyPlatformStyle");
var _ = require("lodash");

exports.create = function(configuration) {
  var input = tabris.create("TextInput", _.extend({
    class: "input"
  }, configuration));
  applyPlatformStyle(input);
  applyPlatformStyle(input);
  return input;
};

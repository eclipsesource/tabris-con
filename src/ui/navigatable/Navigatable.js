var _ = require("lodash");

exports.create = function(configuration) {
  return tabris.create("Composite", _.extend({
    left: 0, top: 0, right: 0, bottom: 0
  }, configuration));
};

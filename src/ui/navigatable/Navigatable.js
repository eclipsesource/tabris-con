var _ = require("lodash");

exports.create = function(configuration) {
  var navigatable = tabris.create("Composite", _.extend({
    left: 0, top: 0, right: 0, bottom: 0
  }, configuration));
  navigatable.open = function() {
    this.trigger("shouldOpen", this);
  };
  return navigatable;
};

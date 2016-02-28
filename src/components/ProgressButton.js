var Button = require("./Button");
var addProgressTo = require("../helpers/addProgressTo");

exports.create = function(configuration) {
  var button = Button.create(configuration);
  addProgressTo(button);
  return button;
};

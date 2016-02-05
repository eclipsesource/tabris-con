var getImage = require("../getImage");

exports.create = function() {
  var action = tabris.create("Action", {
    id: "attendanceAction",
    image: getImage("plus"),
    placementPriority: "high"
  }).on("change:attending", function(widget, attending) {
    this.set("image", attending ? getImage("check") : getImage("plus"));
  });
  return action;
};

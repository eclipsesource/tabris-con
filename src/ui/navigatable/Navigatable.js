var _ = require("lodash");
var getImage = require("../../getImage");

exports.create = function(configuration) {
  var navigatable = tabris.create("Composite", _.extend({
    class: "navigatable",
    left: 0, top: 0, right: 0, bottom: 0,
    active: true
  }, configuration))
    .on("change:active", function(widget, active) {
      navigatable.updateImage();
      this.trigger(active ? "appear" : "disappear", this);
    });

  navigatable.updateImage = function() {
    this.set("image", getImageVariant(navigatable, this.get("active")));
  };

  navigatable.open = function() {
    var parent = navigatable.parent();
    if (parent instanceof tabris.Tab) {
      parent.parent().set("selection", parent);
      tabris.ui.find("#mainPage").first().open();
    } else if (parent instanceof tabris.Page) {
      parent.open();
    }
    return navigatable;
  };

  navigatable.updateImage();

  return navigatable;

  function getImageVariant(navigatable, active) {
    var imageName = navigatable.get("id");
    return getImage.forDevicePlatform(active ? imageName + "_selected" : imageName);
  }
};

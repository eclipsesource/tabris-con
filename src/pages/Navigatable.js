var _ = require("lodash");
var getImage = require("../helpers/getImage");
var Promise = require("promise");
var colors = require("../resources/colors");

exports.create = function(configuration) {
  var navigatable = tabris.create("Composite", _.extend({
    class: "navigatable",
    left: 0, top: 0, right: 0, bottom: 0,
    active: true
  }, configuration));

  navigatable.initializeItems = function() {return Promise.resolve();}; // stub

  navigatable.updateImage = function() {
    this.set("image", getImageVariant(this, this.get("active")));
  };

  navigatable.asTab = function() {
    var tab = tabris.create("Tab", {
      title: navigatable.get("title"),
      id: navigatable.get("id") + "Tab",
      textColor: colors.TINT_COLOR,
      navigatable: navigatable,
      image: navigatable.get("image"),
      left: 0, top: 0, right: 0, bottom: 0
    }).on("change:data", function(widget, data) {navigatable.set("data", data);});
    navigatable.appendTo(tab);
    return navigatable;
  };

  navigatable.asPage = function() {
    var page = tabris.create("Page", {
      topLevel: true,
      title: navigatable.get("title"),
      navigatable: navigatable,
      id: navigatable.get("id") + "Page"
    }).on("change:data", function(widget, data) {navigatable.set("data", data);})
      .on("appear", function() {
        navigatable.activate();
      });
    navigatable.appendTo(page);
    return navigatable;
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

  navigatable.activate = function() {
    tabris.ui
      .find(".navigatable")
      .forEach(function(navigatableWidget) {
        if (navigatableWidget.get("active")) {
          navigatableWidget.set("active", false);
        }
      });
    navigatable.set("active", true);
  };

  navigatable.updateImage();

  navigatable.on("change:active", function(widget, active) {
    navigatable.updateImage();
    this.trigger(active ? "appear" : "disappear", this);
  });

  navigatable.once("appear", function() {
    if (!navigatable.get("data")) {
      navigatable.initializeItems();
    }
  });

  return navigatable;
};

function getImageVariant(navigatable, active) {
  var imageName = navigatable.get("id");
  return getImage.forDevicePlatform(active ? imageName + "_selected" : imageName);
}

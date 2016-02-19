var Schedule = require("./navigatable/Schedule");
var Tracks = require("./navigatable/Tracks");
var Map = require("./navigatable/Map");
var Drawer = require("./Drawer");
var About = require("./navigatable/About");
var colors = require("../../resources/colors");

module.exports = {
  Android: {
    create: function() {
      wrapInPage(Schedule.create());
      var tracksPage = wrapInPage(Tracks.create());
      wrapInPage(Map.create());
      wrapInPage(About.create());
      Drawer.create();
      tracksPage.open();
    }
  },
  iOS: {
    create: function() {
      var mainPage = tabris.create("Page", {
        id: "mainPage",
        topLevel: true
      }).open();
      var tabFolder = tabris.create("TabFolder", {
        left: 0, top: 0, right: 0, bottom: 0,
        textColor: colors.TINT_COLOR,
        tabBarLocation: "bottom"
      }).on("change:selection", function(tabFolder, tab) {
        mainPage.set("title", tab.get("title"));
        updateNavigatablesActiveState(tab);
        tabFolder.children("Tab").forEach(function(tab) {
          tab.set("image", tab.find(".navigatable").first().get("image"));
        });
      }).appendTo(mainPage);
      wrapInTabFolder(Schedule.create(), tabFolder);
      var tracksTab = wrapInTabFolder(Tracks.create(), tabFolder);
      wrapInTabFolder(Map.create(), tabFolder);
      wrapInTabFolder(About.create(), tabFolder);
      setTimeout(function() {
        tracksTab.open(); // TODO: tab open delayed as part of a workaround for tabris-ios#841
      }, 100);
    }
  },
  UWP: {
    create: function() {
      wrapInPage(Schedule.create());
      var tracksPage = wrapInPage(Tracks.create());
      wrapInPage(Map.create());
      wrapInPage(About.create());
      Drawer.create();
      tracksPage.open();
    }
  }
};

function wrapInTabFolder(navigatable, tabFolder) {
  var tab = tabris.create("Tab", {
    title: navigatable.get("title"),
    id: navigatable.get("id") + "Tab",
    textColor: colors.TINT_COLOR,
    left: 0, top: 0, right: 0, bottom: 0
  }).on("change:data", function(widget, data) {navigatable.set("data", data);});
  navigatable.appendTo(tab);
  tab.appendTo(tabFolder);
  tab.set("image", navigatable.get("image"));
  return navigatable;
}

function wrapInPage(navigatable) {
  var page = tabris.create("Page", {
    topLevel: true,
    title: navigatable.get("title"),
    id: navigatable.get("id") + "Page"
  }).on("change:data", function(widget, data) {navigatable.set("data", data);})
    .on("appear", updateNavigatablesActiveState);

  navigatable.appendTo(page);
  return navigatable;
}

function updateNavigatablesActiveState(navigatableWrapper) {
  var selectedNavigatable = navigatableWrapper.find(".navigatable").first();
  tabris.ui
    .find(".navigatable")
    .forEach(function(navigatable) {
      if (navigatable.get("active")) {
        navigatable.set("active", false);
      }
    });
  selectedNavigatable.set("active", true);
}

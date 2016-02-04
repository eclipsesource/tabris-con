var Schedule = require("./navigatable/Schedule");
var Explore = require("./navigatable/Explore");
var Map = require("./navigatable/Map");
var Drawer = require("./Drawer");
var Settings = require("./navigatable/Settings");
var viewDataProvider = require("../data/viewDataProvider");
var colors = require("../../resources/colors");

module.exports = {
  Android: {
    create: function() {
      wrapInPage(Schedule.create()).once("appear", populateBlocks);
      wrapInPage(Explore.create()).once("appear", populatePreviewCategories).open();
      wrapInPage(Map.create());
      wrapInPage(Settings.create());
      Drawer.create();
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
      }).on("change:selection", function(widget, tab) {
        mainPage.set("title", tab.get("title"));
      }).appendTo(mainPage);
      wrapInTabFolder(Schedule.create(), tabFolder)
        .once("appear", function() {
          populateBlocks(this);
        });
      wrapInTabFolder(Explore.create(), tabFolder)
        .once("appear", function() {
          populatePreviewCategories(this);
        })
        .open();
      wrapInTabFolder(Map.create(), tabFolder);
      wrapInTabFolder(Settings.create(), tabFolder);
    }
  },
  UWP: {
    create: function() {
      wrapInPage(Schedule.create()).once("appear", populateBlocks);
      wrapInPage(Explore.create()).once("appear", populatePreviewCategories).open();
      wrapInPage(Map.create());
      wrapInPage(Settings.create());
      Drawer.create();
    }
  }
};

function wrapInTabFolder(component, tabFolder) {
  var tab = tabris.create("Tab", {
    title: component.get("title"),
    id: component.get("id") + "Tab",
    image: component.get("image"),
    textColor: colors.TINT_COLOR,
    left: 0, top: 0, right: 0, bottom: 0
  }).on("change:data", function(widget, data) {component.set("data", data);});
  component.appendTo(tab);
  component.open = function() {
    tab.parent().set("selection", tab);
    tabris.ui.find("#mainPage").first().open();
    return component;
  };
  tab.appendTo(tabFolder);
  tabFolder.on("change:selection", function(widget, selection) {
    if (selection === tab) {
      component.trigger("appear", component, tab);
    }
  });
  return component;
}

function wrapInPage(component) {
  var page = tabris.create("Page", {
    topLevel: true,
    title: component.get("title"),
    id: component.get("id") + "Page",
    image: component.get("image")
  }).on("change:data", function(widget, data) {component.set("data", data);})
    .on("appear", function() {component.trigger("appear", component);});
  component.appendTo(page);
  component.open = function() {
    page.open();
    return component;
  };
  return component;
}

function populatePreviewCategories(component) {
  if (!component.get("data")) {
    viewDataProvider.asyncGetPreviewCategories()
      .then(function(previewCategories) {
        component.set("data", previewCategories);
      });
  }
}

function populateBlocks(component) {
  if (!component.get("data")) {
    viewDataProvider.asyncGetBlocks()
      .then(function(blocks) {
        component.set("data", blocks);
      });
  }
}

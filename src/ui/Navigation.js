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
        if (tab.get("id") === "scheduleTab") {
          populateBlocks(tab);
        } else if (tab.get("id") === "exploreTab") {
          populatePreviewCategories(tab);
        }
        mainPage.set("title", tab.get("title"));
      }).appendTo(mainPage);
      wrapInTab(Schedule.create()).appendTo(tabFolder).once("appear", populateBlocks);
      var exploreTab = wrapInTab(Explore.create()).appendTo(tabFolder).once("appear", populatePreviewCategories);
      wrapInTab(Map.create()).appendTo(tabFolder);
      wrapInTab(Settings.create()).appendTo(tabFolder);
      tabFolder.set("selection", exploreTab);
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

function wrapInTab(component) {
  var tab = tabris.create("Tab", {
    title: component.get("title"),
    id: component.get("id") + "Tab",
    image: component.get("image"),
    textColor: colors.TINT_COLOR,
    left: 0, top: 0, right: 0, bottom: 0
  }).on("change:data", function(widget, data) {component.set("data", data);});
  component.appendTo(tab);
  component.on("shouldOpen", function() {
    tab.parent().set("selection", tab);
    tabris.ui.find("#mainPage").first().open();
  });
  return tab;
}

function wrapInPage(component) {
  var page = tabris.create("Page", {
    topLevel: true,
    title: component.get("title"),
    id: component.get("id") + "Page",
    image: component.get("image")
  }).on("change:data", function(widget, data) {component.set("data", data);});
  component.appendTo(page);
  component.on("shouldOpen", function() {
    page.open();
  });
  return page;
}

function populatePreviewCategories(component) {
  viewDataProvider.asyncGetPreviewCategories()
    .then(function(previewCategories) {
      component.set("data", previewCategories);
    });
}

function populateBlocks(component) {
  viewDataProvider.asyncGetBlocks()
    .then(function(blocks) {
      component.set("data", blocks);
    });
}

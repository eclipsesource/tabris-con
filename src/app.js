require("tabris-js-node");
var ExplorePage = require("./pages/ExplorePage");
var SchedulePage = require("./pages/SchedulePage");
var MapPage = require("./pages/MapPage");
var SettingsPage = require("./pages/SettingsPage");
var Drawer = require("./ui/Drawer");
var colors = require("../resources/colors");
var viewDataProvider = require("./data/viewDataProvider");

tabris.ui.set("background", colors.BACKGROUND_COLOR);
tabris.ui.set("textColor", colors.LIGHT_PRIMARY_TEXT_COLOR);

SchedulePage.create().once("appear", populateBlocks);
ExplorePage.create().once("appear", populatePreviewCategories).open();
MapPage.create();
SettingsPage.create();

Drawer.create();

function populatePreviewCategories(page) {
  viewDataProvider.asyncGetPreviewCategories()
    .then(function(previewCategories) {
      page.set("data", previewCategories);
    });
}

function populateBlocks(page) {
  viewDataProvider.asyncGetBlocks()
    .then(function(blocks) {
      page.set("data", blocks);
    });
}

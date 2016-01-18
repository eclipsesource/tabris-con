var ExplorePage = require("./pages/ExplorePage");
var SchedulePage = require("./pages/SchedulePage");
var MapPage = require("./pages/MapPage");
var SettingsPage = require("./pages/SettingsPage");
var Drawer = require("./ui/Drawer");
var colors = require("../resources/colors.json");

tabris.ui.set("background", colors.BACKGROUND_COLOR);
tabris.ui.set("textColor", colors.LIGHT_PRIMARY_TEXT_COLOR);

SchedulePage.create();
ExplorePage.create().open();
MapPage.create();
SettingsPage.create();

Drawer.create();

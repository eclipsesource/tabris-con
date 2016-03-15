var Schedule = require("../pages/Schedule");
var Tracks = require("../pages/Tracks");
var Map = require("../pages/Map");
var About = require("../pages/About");
var TabFolderNavigation = require("./TabFolderNavigation");
var DrawerNavigation = require("./DrawerNavigation");

var navigation = {
  Android: DrawerNavigation,
  UWP: DrawerNavigation,
  iOS: TabFolderNavigation
};

module.exports = {
  create: function() {
    navigation[device.platform]
      .createWith([Schedule, Tracks, Map, About])
      .open("#tracks");
  }
};

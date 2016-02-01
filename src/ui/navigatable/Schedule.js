var colors = require("../../../resources/colors");
var CollectionView = require("../../ui/CollectionView");
var LoadingIndicator = require("../../ui/LoadingIndicator");
var getImage = require("../../getImage");
var Navigatable = require("./Navigatable");

exports.create = function() {
  var schedule = Navigatable.create({
    id: "schedule",
    title: "My Schedule",
    image: getImage("schedule"),
    left: 0, top: 0, right: 0, bottom: 0
  });

  var loadingIndicator = LoadingIndicator.create().appendTo(schedule);

  schedule.on("change:data", function(widget, adaptedBlocks) {
    if (schedule.children("#scheduleTabFolder").length > 0) {
      adaptedBlocks.forEach(function(adaptedBlock) {
        schedule.find("#" + adaptedBlock.day).set("items", adaptedBlock.blocks);
      });
      return;
    }
    loadingIndicator.dispose();
    var tabFolder = tabris.create("TabFolder", {
      id: "scheduleTabFolder",
      layoutData: {left: 0, top: 0, right: 0, bottom: 0},
      elevation: 4,
      tabBarLocation: "top",
      background: colors.BACKGROUND_COLOR,
      textColor: "white",
      paging: true
    }).appendTo(schedule);
    populateTabFolder(tabFolder, adaptedBlocks);
  });

  return schedule;
};

function populateTabFolder(tabFolder, adaptedBlocks) {
  adaptedBlocks.forEach(function(blockObject) {
    var tab = createTab(blockObject.day).appendTo(tabFolder);
    CollectionView.create({
      id: blockObject.day,
      left: 0, top: 0, right: 0, bottom: 0, opacity: 0,
      items: blockObject.blocks
    }).appendTo(tab).animate({opacity: 1}, {duration: 250});
  });
}

function createTab(title) {
  return tabris.create("Tab", {title: title, background: "white"});
}

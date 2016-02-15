var CollectionView = require("../../ui/CollectionView");
var applyPlatformStyle = require("../../ui/applyPlatformStyle");
var LoadingIndicator = require("../../ui/LoadingIndicator");
var getImage = require("../../getImage");
var Navigatable = require("./Navigatable");
var _ = require("lodash");

function maybeFocusItem(schedule) {
  var sessionId = schedule.get("shouldFocusItem");
  if (sessionId) {
    var tab = findBlockTab(schedule, sessionId);
    schedule.children("#scheduleTabFolder").set("selection", tab);
    var collectionView = tab.children("CollectionView").first();
    var collectionViewItems = collectionView.get("items");
    var index = _.findIndex(collectionViewItems, function(item) {
      return item.sessionId === sessionId;
    });
    collectionView.get("items")[index].shouldPop = true;
    schedule.set("shouldFocusItem", null);
    if (collectionView.get("bounds").height === 0) { // TODO: workaround for reveal only working after resize on iOS
      collectionView.once("resize", function() {collectionView.reveal(index);});
    } else {
      collectionView.reveal(index);
    }
  }
}

function findBlockTab(schedule, sessionId) {
  var scheduleData = schedule.get("data");
  var index = _.findIndex(scheduleData, function(object) {
    return _.some(object.blocks, function(block) {return sessionId === block.sessionId;});
  });
  return schedule.children("#scheduleTabFolder").children()[index];
}

exports.create = function() {
  var schedule = Navigatable.create({
    id: "schedule",
    title: "My Schedule",
    image: getImage.forDevicePlatform("schedule_selected"), // TODO: selected image initially shown as part of workaround for tabris-ios#841
    left: 0, top: 0, right: 0, bottom: 0
  }).on("change:focus", function(widget, focus) {
    schedule.set("shouldFocusItem", focus);
  }).on("appear", function() {
    maybeFocusItem(schedule);
  });

  var loadingIndicator = LoadingIndicator.create().appendTo(schedule);

  schedule.once("change:data", function(widget, adaptedBlocks) {
    loadingIndicator.dispose();
    var tabFolder = tabris.create("TabFolder", {
      id: "scheduleTabFolder",
      layoutData: {left: 0, top: 0, right: 0, bottom: 0},
      elevation: 4,
      tabBarLocation: "top",
      paging: true
    }).appendTo(schedule);
    applyPlatformStyle(tabFolder);
    createTabs(tabFolder, adaptedBlocks);
  });

  schedule.on("change:data", function(widget, adaptedBlocks) {
    adaptedBlocks.forEach(function(adaptedBlock) {
      var collectionView = schedule.find("#" + adaptedBlock.day);
      collectionView.set("items", adaptedBlock.blocks);
    });
  });

  return schedule;
};

function createTabs(tabFolder, adaptedBlocks) {
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

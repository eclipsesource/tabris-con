var CollectionView = require("../../ui/CollectionView");
var applyPlatformStyle = require("../../ui/applyPlatformStyle");
var makeUpdatable = require("../../ui/makeUpdatable");
var LoadingIndicator = require("../../ui/LoadingIndicator");
var getImage = require("../../getImage");
var Navigatable = require("./Navigatable");
var viewDataProvider = require("../../data/viewDataProvider");
var _ = require("lodash");

exports.create = function() {
  var schedule = Navigatable.create({
    id: "schedule",
    title: "My Schedule",
    image: getImage.forDevicePlatform("schedule_selected"), // TODO: selected image initially shown as part of workaround for tabris-ios#841
    left: 0, top: 0, right: 0, bottom: 0
  });

  tabris.app.on("resume", function() {schedule.initializeItems({silent: true});});

  var loadingIndicator = LoadingIndicator.create().appendTo(schedule);

  schedule.getSessionIdTab = function(sessionId) {
    var index = _.findIndex(schedule.get("data"), function(object) {
      return _.some(object.blocks, function(block) {return sessionId === block.sessionId;});
    });
    return schedule.children("#scheduleTabFolder").children()[index];
  };

  schedule.initializeItems = function(options) {
    if (!schedule.get("initializingItems")) {
      if (!(options && options.silent)) {
        showProgressIndicator(schedule);
      }
      schedule.set("initializingItems", true);
      return viewDataProvider.getScheduleBlocks()
        .then(function(data) {
          schedule.set("data", data);
        })
        .finally(function() {
          schedule.find("CollectionView").set("refreshIndicator", false);
          schedule.children("#loadingIndicator").dispose();
          schedule.set("initializingItems", false);
        });
    }
  };

  schedule.updateSessionWithId = function(id, property, value) {
    var collectionView = getItemCollectionView(schedule, id);
    if (collectionView) {
      var items = collectionView.get("items");
      var index = _.findIndex(items, {sessionId: id});
      items[index][property] = value;
      collectionView.refresh(index);
    }
  };

  schedule.findSessionById = function(sessionId) {
    var found;
    schedule.get("data").forEach(function(blockObject) {
      blockObject.blocks.forEach(function(block) {
        if (block.sessionId === sessionId) {
          found = block;
        }
      });
    });
    return found;
  };

  schedule.once("change:data", function(widget, blocks) {
    loadingIndicator.dispose();
    var tabFolder = tabris.create("TabFolder", {
      id: "scheduleTabFolder",
      layoutData: {left: 0, top: 0, right: 0, bottom: 0},
      elevation: 4,
      tabBarLocation: "top",
      paging: true
    }).appendTo(schedule);
    applyPlatformStyle(tabFolder);
    createTabs(tabFolder, blocks);
  });

  schedule.on("change:data", function(widget, blocks) {
    blocks.forEach(function(blockObject) {
      var collectionView = schedule.find("#" + blockObject.day);
      collectionView.set("items", blockObject.blocks);
    });
  });

  schedule.on("change:focus", function(widget, focus) {
    schedule.set("shouldFocusSessionWithId", focus);
  });

  schedule.on("appear", function() {
    schedule.initializeItems({silent: true});
    if (schedule.get("initializingItems")) {
      schedule.once("change:initializingItems", maybeFocusItem);
    } else {
      maybeFocusItem(this);
    }
  });
  return schedule;
};

function showProgressIndicator(schedule) {
  if (device.platform === "iOS" && !pulledToRefresh(schedule)) {
    LoadingIndicator.create({shade: true, semitransparent: true}).appendTo(schedule);
  } else {
    schedule.find("CollectionView").set("refreshIndicator", true);
  }
}

function getItemCollectionView(schedule, sessionId) {
  var tab = schedule.getSessionIdTab(sessionId);
  return tab ? tab.find("CollectionView").first() : null;
}

function maybeFocusItem(schedule) {
  var sessionId = schedule.get("shouldFocusSessionWithId");
  if (sessionId) {
    schedule.set("shouldFocusSessionWithId", null);
    var tab = schedule.getSessionIdTab(sessionId);
    if (tab) {
      schedule.children("#scheduleTabFolder").set("selection", tab);
      var collectionView = tab.children("CollectionView").first();
      var collectionViewItems = collectionView.get("items");
      var index = _.findIndex(collectionViewItems, function(item) {
        return item.sessionId === sessionId;
      });
      collectionView.get("items")[index].shouldPop = true;
      if (collectionView.get("bounds").height === 0) { // TODO: workaround for reveal only working after resize on iOS
        collectionView.once("resize", function() {collectionView.reveal(index);});
      } else {
        collectionView.reveal(index);
      }
    }
  }
}

function createTabs(tabFolder, adaptedBlocks) {
  adaptedBlocks.forEach(function(blockObject) {
    var tab = createTab(blockObject.day).appendTo(tabFolder);
    var collectionView = CollectionView.create({
      id: blockObject.day,
      left: 0, top: 0, right: 0, bottom: 0, opacity: 0,
      items: blockObject.blocks
    }).appendTo(tab);
    makeUpdatable(collectionView);
    collectionView.animate({opacity: 1}, {duration: 250});
  });
}

function createTab(title) {
  return tabris.create("Tab", {title: title, background: "white"});
}

function pulledToRefresh(schedule) {
  return schedule.find("CollectionView").toArray()
    .some(function(collectionView) {return collectionView.get("refreshIndicator");});
}

var CollectionView = require("../components/collectionView/CollectionView");
var applyPlatformStyle = require("../helpers/applyPlatformStyle");
var makeUpdatable = require("../helpers/makeUpdatable");
var LoadingIndicator = require("../components/LoadingIndicator");
var getImage = require("../helpers/getImage");
var Navigatable = require("./Navigatable");
var viewDataProvider = require("../viewDataProvider");
var _ = require("lodash");

exports.create = function() {
  var schedule = Navigatable.create({
    id: "schedule",
    title: "My Schedule",
    image: getImage.forDevicePlatform("schedule_selected"), // TODO: selected image initially shown as part of workaround for tabris-ios#841
    left: 0, top: 0, right: 0, bottom: 0
  });

  var loadingIndicator = LoadingIndicator.create().appendTo(schedule);

  schedule.getSessionIdTab = function(sessionId) {
    var index = _.findIndex(schedule.get("data"), function(object) {
      return _.some(object.blocks, function(block) {return sessionId === block.sessionId;});
    });
    return schedule.children("#scheduleTabFolder").children()[index];
  };

  schedule.initializeItems = function() {
    if (!schedule.get("initializingItems")) {
      schedule.set("initializingItems", true);
      return viewDataProvider.getBlocks()
        .then(function(data) {
          schedule.set("data", data);
          initializeIndicators();
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
    if (schedule.get("initializingItems")) {
      schedule.once("change:initializingItems", maybeFocusItem);
    } else {
      maybeFocusItem(this);
    }
    updateFeedbackIndicators();
  });

  tabris.app.on("resume", function() {
    updateFeedbackIndicators();
  });

  function initializeIndicators() {
    if (!schedule.get("indicatorsInitialized") && !schedule.get("evaluatedSessionId")) {
      updateAllFeedbackIndicators();
      schedule.set("indicatorsInitialized", true);
    }
  }

  function updateFeedbackIndicators() {
    if (schedule.get("evaluatedSessionId")) {
      updateEvaluatedSessionIndicator();
    } else {
      updateAllFeedbackIndicators();
    }
  }

  function updateEvaluatedSessionIndicator() {
    if (schedule.get("evaluatedSessionId")) {
      schedule.updateSessionWithId(schedule.get("evaluatedSessionId"), "feedbackIndicatorState", "sent");
      schedule.set("evaluatedSessionId", null);
    }
  }

  function updateAllFeedbackIndicators() {
    updateEvaluatedSessionIndicator();
    viewDataProvider.getSessionIdIndicatorStates()
      .then(function(idStates) {
        if (schedule.get("focusing")) {
          schedule.once("change:focusing", function() {
            applyIdStates(idStates);
          });
        } else {
          applyIdStates(idStates);
        }
      });
  }

  function applyIdStates(idStates) {
    idStates.forEach(function(idState) {
      schedule.updateSessionWithId(idState.id, "feedbackIndicatorState", idState.state);
    });
  }

  return schedule;
};

function getItemCollectionView(schedule, sessionId) {
  var tab = schedule.getSessionIdTab(sessionId);
  return tab ? tab.find("CollectionView").first() : null;
}

function maybeFocusItem(schedule) {
  var sessionId = schedule.get("shouldFocusSessionWithId");
  if (sessionId) {
    schedule.set("shouldFocusSessionWithId", null);
    schedule.set("focusing", true);
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
        collectionView.once("resize", function() {
          collectionView.reveal(index);
          notFocusing(schedule);
        });
      } else {
        collectionView.reveal(index);
        notFocusing(schedule);
      }
    }
  }
}

function notFocusing(schedule) {
  setTimeout(function() {
    schedule.set("focusing", false);
  }, 1600);
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

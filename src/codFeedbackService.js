var loginService = require("./loginService");
var codRemoteService = require("./codRemoteService");
var attendedSessionService = require("./attendedSessionService");
var loginService = require("./loginService");
var config = require("../config");
var _ = require("lodash");

exports.updateLastSelectedSessionFeedbackIndicator = function(schedule) {
  var lastSelectedSessionId = schedule.get("lastSelectedSessionId");
  if (lastSelectedSessionId && loginService.isLoggedIn()) {
    schedule.set("lastSelectedSessionId", null);
    var collectionView = getItemCollectionView(schedule, lastSelectedSessionId);
    if (collectionView) {
      if (device.platform === "iOS") {
        setTimeout(setIndicatorState, 700);
      } else {
        updateCollectionViewItem(collectionView, lastSelectedSessionId, "loading");
        setIndicatorState();
      }
    }
  }

  function setIndicatorState() {
    codRemoteService.evaluations()
      .then(function(evaluations) {
        var session = findSessionById(schedule.get("data"), lastSelectedSessionId);
        updateCollectionViewItem(collectionView, lastSelectedSessionId,
          getSessionFeedbackIndicatorState(evaluations, session));
      })
      .catch(function(e) {
        console.log(e);
        console.log(e.stack);
        updateCollectionViewItem(collectionView, lastSelectedSessionId, null);
      });
  }
};

exports.addFeedbackIndicatorState = function(blocksEvaluations) {
  if (loginService.isLoggedIn()) {
    blocksEvaluations.blocks.forEach(function(blockObject) {
      blockObject.blocks.map(function(block) {
        setSessionFeedbackIndicatorState(blocksEvaluations, block);
        return block;
      });
    });
  }
};

exports.canGiveFeedbackForSession = function(session) {
  return attendedSessionService.isAttending(session.id) && validFeedbackWindow(session);
};

function setSessionFeedbackIndicatorState(blocksEvaluations, block) {
  if (block.sessionNid) {
    block.feedbackIndicatorState = getSessionFeedbackIndicatorState(blocksEvaluations.evaluations, block);
  }
}

function getSessionFeedbackIndicatorState(evaluations, block) {
  if (validFeedbackWindow(block)) {
    return _.find(evaluations, {nid: block.sessionNid}) ? "sent" : "pending";
  } else {
    return null;
  }
}

function validFeedbackWindow(session) {
  var currentDate = new Date();
  return currentDate > new Date(session.endTimestamp) && currentDate < new Date(config.FEEDBACK_DEADLINE);
}

function getItemCollectionView(schedule, sessionId) {
  var tab = schedule.getSessionIdTab(sessionId);
  return tab ? tab.find("CollectionView").first() : null;
}

function updateCollectionViewItem(collectionView, sessionId, value) {
  var items = collectionView.get("items");
  var index = _.findIndex(items, {sessionId: sessionId});
  items[index].feedbackIndicatorState = value;
  collectionView.refresh(index);
}

function findSessionById(adaptedBlocks, sessionId) {
  var found;
  adaptedBlocks.forEach(function(blockObject) {
    blockObject.blocks.forEach(function(block) {
      if (block.sessionId === sessionId) {
        found = block;
      }
    });
  });
  return found;
}

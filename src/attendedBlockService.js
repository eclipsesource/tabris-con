var persistedStorage = require("./data/persistedStorage");
var viewDataProvider = require("./data/viewDataProvider");

exports.addAttendedBlockId = function(sessionId) {
  persistedStorage.addAttendedBlockId(sessionId);
  updateSchedulePage();
};

exports.removeAttendedBlockId = function(sessionId) {
  persistedStorage.removeAttendedBlockId(sessionId);
  updateSchedulePage();
};

exports.isAttending = function(sessionId) {
  return persistedStorage.getAttendedBlocks().indexOf(sessionId) > -1;
};

function updateSchedulePage() {
  var page = tabris.ui.find("#schedulePage");
  viewDataProvider.asyncGetBlocks()
    .then(function(blocks) {
      page.set("data", blocks);
    });
}

var persistedStorage = require("./data/persistedStorage");
var viewDataProvider = require("./data/viewDataProvider");

exports.addAttendedBlockId = function(sessionId) {
  persistedStorage.addAttendedBlockId(sessionId);
  updateScheduleNavigatable();
};

exports.removeAttendedBlockId = function(sessionId) {
  persistedStorage.removeAttendedBlockId(sessionId);
  updateScheduleNavigatable();
};

exports.isAttending = function(sessionId) {
  return persistedStorage.getAttendedBlocks().indexOf(sessionId) > -1;
};

function updateScheduleNavigatable() {
  var scheduleNavigatable = tabris.ui.find("#schedule");
  viewDataProvider.asyncGetBlocks()
    .then(function(blocks) {
      scheduleNavigatable.set("data", blocks);
    });
}

var conferenceDataProvider = require("../conferenceDataProvider");

exports.updateData = function() {
  conferenceDataProvider.invalidateCache();
  var schedule = tabris.ui.find("#schedule").first();
  if (schedule) {
    schedule.set("indicatorsInitialized", false);
  }
  var promises = tabris.ui.find(".navigatable").toArray()
    .map(function(navigatable) {
      return navigatable.initializeItems();
    });
  return Promise.all(promises).catch(function(e) {console.log(e);});
};

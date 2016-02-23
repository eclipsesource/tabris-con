var conferenceDataProvider = require("./data/conferenceDataProvider");
var Promise = require("promise");

exports.updateData = function() {
  conferenceDataProvider.invalidateCache();
  var promises = tabris.ui.find(".navigatable").toArray()
    .map(function(navigatable) {
      return navigatable.initializeItems();
    });
  return Promise.all(promises).catch(function(e) {console.log(e);});
};

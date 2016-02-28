var viewDataUpdateService = require("./viewDataUpdateService");

module.exports = function(collectionView) {
  collectionView.set("class", (collectionView.get("class") || "") + "updatableCollectionView");
  collectionView.set("refreshEnabled", true);
  collectionView.on("refresh", function() {
    collectionView.set("refreshIndicator", true);
    viewDataUpdateService.updateData()
      .then(function() {
        collectionView.set("refreshIndicator", false);
      });
  });
};

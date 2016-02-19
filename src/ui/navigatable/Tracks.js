var CollectionView = require("../CollectionView");
var LoadingIndicator = require("../LoadingIndicator");
var getImage = require("../../getImage");
var Navigatable = require("./Navigatable");
var viewDataProvider = require("../../data/viewDataProvider");

exports.create = function() {
  var tracks = Navigatable.create({
    id: "tracks",
    title: "Tracks",
    image: getImage.forDevicePlatform("tracks_selected") // TODO: selected image initially shown as part of workaround for tabris-ios#841
  });

  tracks.initializeItems = function() {
    viewDataProvider.asyncGetPreviewCategories()
      .then(function(previewCategories) {
        tracks.set("data", previewCategories);
      });
  };

  var loadingIndicator = LoadingIndicator.create().appendTo(tracks);

  var collectionView = CollectionView.create({
    left: 0, top: 0, right: 0, bottom: 0, opacity: 0
  }).appendTo(tracks);

  tracks.on("change:data", function(widget, data) {
    if (collectionView.get("items").length > 0) {
      return;
    }
    collectionView.set("items", data);
    collectionView.animate({opacity: 1}, {duration: 250});
    loadingIndicator.dispose();
  });

  return tracks;
};

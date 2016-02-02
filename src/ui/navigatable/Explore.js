var CollectionView = require("../CollectionView");
var LoadingIndicator = require("../LoadingIndicator");
var getImage = require("../../getImage");
var Navigatable = require("./Navigatable");

exports.create = function() {
  var explore = Navigatable.create({
    id: "explore",
    title: "Explore",
    image: getImage("explore")
  });

  var loadingIndicator = LoadingIndicator.create().appendTo(explore);

  var collectionView = CollectionView.create({
    left: 0, top: 0, right: 0, bottom: 0, opacity: 0
  }).appendTo(explore);

  explore.on("change:data", function(widget, data) {
    if (collectionView.get("items").length > 0) {
      return;
    }
    collectionView.set("items", data);
    collectionView.animate({opacity: 1}, {duration: 250});
    loadingIndicator.dispose();
  });

  return explore;
};
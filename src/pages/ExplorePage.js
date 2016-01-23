var CollectionView = require("../ui/CollectionView");
var LoadingIndicator = require("../ui/LoadingIndicator");
var getImage = require("../getImage");

exports.create = function() {
  var page = tabris.create("Page", {
    id: "explorePage",
    topLevel: true,
    title: "Explore",
    image: getImage("explore")
  }).on("change:data", function(widget, data) {
    if(collectionView.get("items").length > 0) {
      return;
    }
    collectionView.set("items", data);
    collectionView.animate({opacity: 1}, {duration: 250});
    loadingIndicator.set("visible", false);
  });

  var loadingIndicator = LoadingIndicator.create().appendTo(page);

  var collectionView = CollectionView.create({
    left: 0, top: 0, right: 0, bottom: 0, opacity: 0
  }).appendTo(page);

  return page;
};

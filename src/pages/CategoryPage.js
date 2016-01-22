var LoadingIndicator = require("../ui/LoadingIndicator");
var CollectionView = require("../ui/CollectionView");

exports.create = function() {
  var page = tabris.create("Page", {
    id: "categoryPage",
    title: "Loading..."
  }).on("change:data", function(page, data) {
    page.set("title", data.title);
    collectionView.set("items", data.items);
    collectionView.animate({opacity: 1}, {duration: 250});
    loadingIndicator.set("visible", false);
  });

  var loadingIndicator = LoadingIndicator.create().appendTo(page);

  var collectionView = CollectionView.create({
    left: 0, top: 0, right: 0, bottom: 0, opacity: 0
  }).appendTo(page);
  return page;
};

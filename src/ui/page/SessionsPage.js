var LoadingIndicator = require("../LoadingIndicator");
var CollectionView = require("../CollectionView");
var applyPlatformStyle = require("../applyPlatformStyle");

exports.create = function() {
  var page = tabris.create("Page", {
    id: "sessionsPage",
    title: "Loading..."
  });

  var loadingIndicator = LoadingIndicator.create().appendTo(page);

  var collectionView = CollectionView.create({
    left: 0, top: 0, right: 0, bottom: 0, opacity: 0
  }).appendTo(page);

  page.on("change:data", function(page, data) {
    page.set("title", data.title);
    collectionView.set("items", data.items);
    collectionView.animate({opacity: 1}, {duration: 250});
    loadingIndicator.dispose();
  });

  return page;
};

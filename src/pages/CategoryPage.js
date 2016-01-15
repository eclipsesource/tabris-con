exports.create = function() {
  var collectionViewItem = require("../ui/collectionViewItem");
  var page = tabris.create("Page", {
    id: "categoryPage"
  }).on("change:data", function(page, data) {
    page.set("title", data.title);
    collectionView.set("items", data.items);
  });
  var collectionView = tabris.create("CollectionView", {
    left: 0, top: 0, right: 0, bottom: 0,
    itemHeight: collectionViewItem.detailedSession.itemHeight,
    initializeCell: collectionViewItem.detailedSession.initializeCell
  }).appendTo(page);
  return page;
};

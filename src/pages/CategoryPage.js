var LoadingIndicator = require("../ui/LoadingIndicator");

exports.create = function() {
  var collectionViewItem = require("../ui/collectionViewItem");
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

  var collectionView = tabris.create("CollectionView", {
    left: 0, top: 0, right: 0, bottom: 0, opacity: 0,
    cellType: function(item) {
      return item.type;
    },
    itemHeight: function(item, type) {
      return collectionViewItem[type].itemHeight;
    },
    initializeCell: function(cell, type) {
      collectionViewItem[type].initializeCell(cell);
    }
  }).on("select", function(widget, item) {
    collectionViewItem[item.type].select(widget, item);
  }).appendTo(page);
  return page;
};

var viewDataProvider = require("../data/viewDataProvider");
var collectionViewItem = require("../ui/collectionViewItem");

exports.create = function() {
  var page = tabris.create("Page", {
    id: "explorePage",
    topLevel: true,
    title: "Explore",
    image: {src: "resources/images/explore.png", scale: 2}
  });

  tabris.create("CollectionView", {
    left: 0, top: 0, right: 0, bottom: 0,
    items: viewDataProvider.getPreviewCategories(),
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

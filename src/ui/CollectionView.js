var _ = require("lodash");

exports.create = function(configuration) {
  return tabris.create("CollectionView", _.extend({
    left: 0, top: 0, right: 0, bottom: 0,
    cellType: function(item) {
      return item.type;
    },
    itemHeight: function(item, type) {
      return requireItemType(type).itemHeight;
    },
    initializeCell: function(cell, type) {
      requireItemType(type).initializeCell(cell);
    }
  }, configuration)).on("select", function(widget, item) {
    if (item) {
      requireItemType(item.type).select(widget, item);
    }
  });
};

function requireItemType(type) {
  return require("./collectionViewItem/" + type + "CollectionViewItem");
}

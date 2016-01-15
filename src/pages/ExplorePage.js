var colors = require("../../resources/colors.json");
var truncate = require("underscore.string/truncate");
var dataProvider = require("../data/dataProvider");

exports.create = function() {
  var page = tabris.create("Page", {
    id: "explorePage",
    topLevel: true,
    title: "Explore",
    image: {src: "resources/images/explore.png", scale: 2}
  });

  var collectionViewItem = {
    title: {
      height: 48,
      initializeCell: function(cell) {
        var header = tabris.create("Composite", {
          left: 0, top: 0, right: 0, height: 48
        }).appendTo(cell);
        var titleTextView = tabris.create("TextView", {
          left: 16, centerY: 0,
          font: "bold 16px"
        }).appendTo(header);
        tabris.create("TextView", {
          right: 16, centerY: 0,
          textColor: colors.ACCENTED_TEXT_COLOR,
          font: "bold 14px",
          text: "MORE"
        }).appendTo(header);
        cell.on("change:item", function(cell, item) {
          titleTextView.set("text", item.title);
        });
      }
    },
    session: {
      height: 96,
      initializeCell: function(cell) {
        var itemEntry = createItemEntry().appendTo(cell);
        cell.on("change:item", function(cell, item) {
          itemEntry.set("data", item);
        });
      }
    },
    separator: {
      height: 8,
      initializeCell: function(cell) {
        cell.set("background", colors.LIGHT_BACKGROUND_COLOR);
      }
    }
  };

  tabris.create("CollectionView", {
    left: 0, top: 0, right: 0, bottom: 0,
    items: dataProvider.getPreviewCategories(),
    cellType: function(item) {
      return item.type;
    },
    itemHeight: function(item, type) {
      return collectionViewItem[type].height;
    },
    initializeCell: function(cell, type) {
      collectionViewItem[type].initializeCell(cell);
    }
  }).appendTo(page);

  function createItemEntry() {
    var itemEntry = tabris.create("Composite", {
      left: 16, right: 16, top: 0, height: 96
    }).on("change:data", function(widget, data) {
      imageView.set("image", {src: data.image});
      titleTextView.set("text", truncate(data.title, 50));
      descriptionTextView.set("text", truncate(data.text, 60));
    });
    tabris.create("Composite", {left: 0, top: "prev()", right: 0, height: 4}).appendTo(itemEntry);
    var imageView = tabris.create("ImageView", {
      centerY: 0, width: 120, height: 72,
      scaleMode: "fill",
    }).appendTo(itemEntry);
    var titleTextView = tabris.create("TextView", {
      layoutData: {left: [imageView, 16], top: 12, right: 8},
      font: "bold 14px",
      textColor: colors.ACCENTED_TEXT_COLOR
    }).appendTo(itemEntry);
    var descriptionTextView = tabris.create("TextView", {
      layoutData: {left: [imageView, 16], top: [titleTextView, 2]},
      font: "12px",
      textColor: colors.DARK_TEXT_COLOR,
      opacity: 0.78
    }).appendTo(itemEntry);
    return itemEntry;
  }
  return page;
};

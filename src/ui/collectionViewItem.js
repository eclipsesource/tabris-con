var colors = require("../../resources/colors.json");
var collectionViewDataProvider = require("../data/collectionViewDataProvider");
var CategoryPage = require("../pages/CategoryPage");
var truncate = require("underscore.string/truncate");

module.exports = {
  title: {
    itemHeight: 48,
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
    },
    select: function(widget, item) {
      CategoryPage
        .create()
        .open()
        .set("data", {
          title: item.title,
          items: collectionViewDataProvider.getCategory(item.id)
        });
    }
  },
  session: {
    itemHeight: 96,
    initializeCell: function(cell) {
      var sessionItem = createSessionItem().appendTo(cell);
      cell.on("change:item", function(cell, item) {
        sessionItem.set("data", item);
      });
    },
    select: function() {}
  },
  separator: {
    itemHeight: 8,
    initializeCell: function(cell) {
      cell.set("background", colors.LIGHT_BACKGROUND_COLOR);
    },
    select: function() {}
  },
  detailedSession: {
    itemHeight: 96,
    initializeCell: function(cell) {
      var sessionItem = createDetailedSessionItem().appendTo(cell);
      cell.on("change:item", function(cell, item) {
        sessionItem.set("data", item);
      });
    },
    select: function() {}
  }
};

function createDetailedSessionItem() {
  var sessionItem = createSessionItemContainer()
    .on("change:data", function(widget, data) {
      imageView.set("image", {src: data.image});
      titleTextView.set("text", truncate(data.title, 50));
      timeframeTextView.set("text", data.timeframe);
    });
  var imageView = createSessionItemImage().appendTo(sessionItem);
  var titleTextView = createSessionItemTextView().appendTo(sessionItem);
  var timeframeTextView = tabris.create("TextView", {
    layoutData: {left: [imageView, 16], top: [titleTextView, 2]},
    font: "14px",
    textColor: colors.DARK_TEXT_COLOR,
    opacity: 0.78
  }).appendTo(sessionItem);
  return sessionItem;
}

function createSessionItem() {
  var sessionItem = createSessionItemContainer()
    .on("change:data", function(widget, data) {
      imageView.set("image", {src: data.image});
      titleTextView.set("text", truncate(data.title, 50));
      descriptionTextView.set("text", truncate(data.text, 60));
    });
  var imageView = createSessionItemImage().appendTo(sessionItem);
  var titleTextView = createSessionItemTextView().appendTo(sessionItem);
  var descriptionTextView = tabris.create("TextView", {
    layoutData: {left: [imageView, 16], top: [titleTextView, 2]},
    font: "12px",
    textColor: colors.DARK_TEXT_COLOR,
    opacity: 0.78
  }).appendTo(sessionItem);
  return sessionItem;
}

function createSessionItemContainer() {
  return tabris.create("Composite", {
    left: 16, right: 16, top: 0, height: 96
  });
}
function createSessionItemImage() {
  return tabris.create("ImageView", {
    id: "imageView",
    centerY: 0, width: 120, height: 72,
    scaleMode: "fill",
  });
}

function createSessionItemTextView() {
  return tabris.create("TextView", {
    layoutData: {left: ["prev()", 16], top: 12, right: 8},
    font: "bold 14px",
    textColor: colors.ACCENTED_TEXT_COLOR
  });
}
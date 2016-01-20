var colors = require("../../resources/colors.json");
var sizes = require("../../resources/sizes.json");
var viewDataProvider = require("../data/viewDataProvider");
var CategoryPage = require("../pages/CategoryPage");
var SessionPage = require("../pages/SessionPage");
var fontToString = require("../fontToString");

module.exports = {
  title: {
    itemHeight: sizes.SESSION_CATEGORY_TITLE_CELL_HEIGHT,
    initializeCell: function(cell) {
      var header = tabris.create("Composite", {
        left: 0, top: 0, right: 0, height: sizes.SESSION_CATEGORY_TITLE_CELL_HEIGHT
      }).appendTo(cell);
      var titleTextView = tabris.create("TextView", {
        left: sizes.MARGIN_BIG, centerY: 0,
        font: fontToString({weight: "bold", size: sizes.FONT_XLARGE})
      }).appendTo(header);
      tabris.create("TextView", {
        right: sizes.MARGIN_BIG, centerY: 0,
        textColor: colors.ACCENTED_TEXT_COLOR,
        font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM}),
        text: "MORE"
      }).appendTo(header);
      cell.on("change:item", function(cell, item) {
        titleTextView.set("text", item.title);
      });
    },
    select: function(widget, item) {
      var page = CategoryPage.create().open();

      viewDataProvider.asyncGetCategory(item.id)
        .then(function(category) {
          page.set("data", {
            title: item.title,
            items: category
          });
        });
    }
  },
  session: {
    itemHeight: sizes.SESSION_CELL_HEIGHT,
    initializeCell: function(cell) {
      var session = createSession().appendTo(cell);
      cell.on("change:item", function(cell, item) {
        session.set("data", item);
      });
    },
    select: sessionSelectCallback
  },
  spacer: {
    itemHeight: sizes.CELL_TYPE_SPACER_HEIGHT,
    initializeCell: function(cell) {
      cell.set("background", "white");
    },
    select: function() {}
  },
  separator: {
    itemHeight: sizes.CELL_TYPE_SEPARATOR_HEIGHT,
    initializeCell: function(cell) {
      cell.set("background", colors.LIGHT_BACKGROUND_COLOR);
    },
    select: function() {}
  },
  categorySession: {
    itemHeight: sizes.SESSION_CELL_HEIGHT,
    initializeCell: function(cell) {
      var session = createCategorySession().appendTo(cell);
      cell.on("change:item", function(cell, item) {
        session.set("data", item);
      });
    },
    select: sessionSelectCallback
  }
};

function createCategorySession() {
  var categorySession = createSessionContainer()
    .on("change:data", function(widget, data) {
      imageView.set("image", data.image);
      titleTextView.set("text", data.title);
      timeframeTextView.set("text", data.timeframe);
    });
  var imageView = createSessionImage().appendTo(categorySession);
  var titleTextView = createSessionTitleTextView().appendTo(categorySession);
  var timeframeTextView = tabris.create("TextView", {
    layoutData: {left: [imageView, sizes.MARGIN_BIG], top: [titleTextView, sizes.MARGIN_XSMALL]},
    font: fontToString({size: sizes.FONT_MEDIUM}),
    textColor: colors.DARK_SECONDARY_TEXT_COLOR
  }).appendTo(categorySession);
  return categorySession;
}

function sessionSelectCallback(widget, item) {
  var sessionPage = SessionPage.create().open();
  viewDataProvider.asyncGetSession(item.id)
    .then(function(session) {
      sessionPage.set("data", session);
    });
}

function createSession() {
  var sessionContainer = createSessionContainer()
    .on("change:data", function(widget, data) {
      imageView.set("image", data.image);
      titleTextView.set("text", data.title);
      descriptionTextView.set("text", data.text);
    });
  var imageView = createSessionImage().appendTo(sessionContainer);
  var titleTextView = createSessionTitleTextView().appendTo(sessionContainer);
  var descriptionTextView = tabris.create("TextView", {
    layoutData: {left: [imageView, sizes.MARGIN_BIG], top: [titleTextView, 0], right: sizes.MARGIN},
    font: fontToString({size: sizes.FONT_MEDIUM}),
    maxLines: 2,
    textColor: colors.DARK_SECONDARY_TEXT_COLOR
  }).appendTo(sessionContainer);
  return sessionContainer;
}

function createSessionContainer() {
  return tabris.create("Composite", {
    left: sizes.MARGIN_BIG, right: sizes.MARGIN_BIG, top: 0, height: sizes.SESSION_CELL_HEIGHT
  });
}

function createSessionImage() {
  return tabris.create("ImageView", {
    id: "imageView",
    centerY: 0, width: sizes.SESSION_CELL_IMAGE_WIDTH, height: sizes.SESSION_CELL_IMAGE_HEIGHT,
    scaleMode: "fill"
  });
}

function createSessionTitleTextView() {
  return tabris.create("TextView", {
    layoutData: {left: ["prev()", sizes.MARGIN_BIG], top: sizes.MARGIN, right: sizes.MARGIN},
    font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM}),
    maxLines: 2,
    textColor: colors.ACCENTED_TEXT_COLOR
  });
}
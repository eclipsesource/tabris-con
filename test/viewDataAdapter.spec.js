var expect = require("chai").expect;
var viewDataAdapter = require("../src/data/viewDataAdapter");
var fakeGlobalForSuite = require("./fakeGlobalForSuite");
var PREVIEW_CATEGORIES = require("./data/googleIO/previewCategories.json");
var ADAPTED_PREVIEW_CATEGORIES = require("./data/googleIO/adaptedPreviewCategories.json");
var PLAY_CATEGORY = require("./data/googleIO/playCategory.json");
var ADAPTED_PLAY_CATEGORY = require("./data/googleIO/adaptedPlayCategory.json");
var SESSION = require("./data/googleIO/session.json");
var ADAPTED_SESSION = require("./data/googleIO/adaptedSession.json");
var BLOCKS = require("./data/googleIO/blocks.json");
var ADAPTED_BLOCKS = require("./data/googleIO/adaptedBlocks.json");

describe("viewDataAdapter", function() {

  fakeGlobalForSuite("window");

  describe("adaptPreviewCategories", function() {

    it("adapts preview categories for collection view", function() {
      var adaptedPreviewCategories = viewDataAdapter
        .adaptPreviewCategories(PREVIEW_CATEGORIES);

      expect(adaptedPreviewCategories).to.deep.equal(ADAPTED_PREVIEW_CATEGORIES);
    });

  });

  describe("adaptCategory", function() {

    it("adapts category for collectionv view", function() {
      var adaptedPreviewCategories = viewDataAdapter.adaptCategory(PLAY_CATEGORY);

      expect(adaptedPreviewCategories).to.deep.equal(ADAPTED_PLAY_CATEGORY);
    });

  });

  describe("adaptSession", function() {
    fakeGlobalForSuite("screen");

    it("adapts session for session page views", function() {
      screen.width = 360;
      screen.height = 642;

      var adaptedSession = viewDataAdapter.adaptSession(SESSION);

      expect(adaptedSession).to.deep.equal(ADAPTED_SESSION);
    });

  });

  describe("adaptBlocks", function() {

    it("adapts blocks for blocks page", function() {
      var config = {
        DATA_FORMAT: "googleIO",
        SESSIONS_HAVE_IMAGES: true,
        CONFERENCE_TIMEZONE: "America/Los_Angeles",
        SCHEDULE_PATTERN_ICON_MAP: {
          googleIO: {
            "^After": "schedule_icon_fun",
            "^Badge": "schedule_icon_badge",
            "^Pre-Keynote": "schedule_icon_session",
            ".*": "schedule_icon_food"
          }
        }
      };

      var adaptedBlocks = viewDataAdapter.adaptBlocks(config, BLOCKS);

      expect(adaptedBlocks).to.deep.equal(ADAPTED_BLOCKS);
    });

  });

});

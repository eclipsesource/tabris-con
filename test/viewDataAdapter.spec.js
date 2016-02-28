var expect = require("chai").expect;
var sinon = require("sinon");
var mockery = require("mockery");
var PREVIEW_CATEGORIES = require("./json/googleIO/previewCategories.json");
var ADAPTED_PREVIEW_CATEGORIES = require("./json/googleIO/adaptedPreviewCategories.json");
var PLAY_CATEGORY = require("./json/googleIO/playCategory.json");
var ADAPTED_PLAY_CATEGORY = require("./json/googleIO/adaptedPlayCategory.json");
var KEYNOTE = require("./json/googleIO/keynote.json");
var SESSION = require("./json/googleIO/session.json");
var ADAPTED_SESSION = require("./json/googleIO/adaptedSession.json");
var BLOCKS = require("./json/googleIO/blocks.json");
var ADAPTED_BLOCKS = require("./json/googleIO/adaptedBlocks.json");
var ADAPTED_KEYNOTE = require("./json/googleIO/adaptedKeynote.json");
var FAKE_CONFIG = {
  DATA_FORMAT: "googleIO",
  SESSIONS_HAVE_IMAGES: true,
  CONFERENCE_TIMEZONE: "America/Los_Angeles",
  CONFERENCE_SCHEDULE_HOUR_RANGE: [7, 8],
  SCHEDULE_PATTERN_ICON_MAP: {
    googleIO: {
      "^After": "schedule_icon_fun",
      "^Badge": "schedule_icon_badge",
      "^Pre-Keynote": "schedule_icon_session",
      ".*": "schedule_icon_food"
    }
  }
};

describe("viewDataAdapter", function() {
  var viewDataAdapter;

  before(function() {
    mockery.enable({useCleanCache: true, warnOnUnregistered: false});
    mockery.registerMock("../config", FAKE_CONFIG);
    mockery.registerMock("../../config", FAKE_CONFIG);
    global.window = sinon.stub();
    viewDataAdapter = require("../src/viewDataAdapter");
  });

  after(function() {
    mockery.deregisterMock("../config");
    mockery.deregisterMock("../../config");
    mockery.disable();
  });

  describe("adaptPreviewCategories", function() {

    it("adapts preview categories for collection view", function() {
      var adaptedPreviewCategories = viewDataAdapter
        .adaptPreviewCategories(PREVIEW_CATEGORIES);

      expect(adaptedPreviewCategories).to.deep.equal(ADAPTED_PREVIEW_CATEGORIES);
    });

  });

  describe("adaptCategory", function() {

    it("adapts category for collection view", function() {
      var adaptedPreviewCategories = viewDataAdapter.adaptCategory(PLAY_CATEGORY);

      expect(adaptedPreviewCategories).to.deep.equal(ADAPTED_PLAY_CATEGORY);
    });

  });

  describe("adaptSession", function() {

    it("adapts session for session page views", function() {
      global.screen = sinon.stub();
      screen.width = 360;
      screen.height = 642;

      var adaptedSession = viewDataAdapter.adaptSession(SESSION);

      expect(adaptedSession).to.deep.equal(ADAPTED_SESSION);
    });

  });

  describe("adaptKeynote", function() {

    it("adapts keynote for session page views", function() {
      var adaptedKeynote = viewDataAdapter.adaptKeynote(KEYNOTE);

      expect(adaptedKeynote).to.deep.equal(ADAPTED_KEYNOTE);
    });

  });

  describe("adaptBlocks", function() {

    it("adapts blocks for blocks page", function() {
      var adaptedBlocks = viewDataAdapter.adaptBlocks(BLOCKS);

      expect(adaptedBlocks).to.deep.equal(ADAPTED_BLOCKS);
    });

  });

});

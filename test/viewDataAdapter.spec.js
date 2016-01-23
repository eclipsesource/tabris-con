var expect = require("chai").expect;
var viewDataAdapter = require("../src/data/viewDataAdapter");
var PREVIEW_CATEGORIES = require("./data/previewCategories.json");
var ADAPTED_PREVIEW_CATEGORIES = require("./data/adaptedPreviewCategories.json");
var PLAY_CATEGORY = require("./data/playCategory.json");
var ADAPTED_PLAY_CATEGORY = require("./data/adaptedPlayCategory.json");
var SESSION = require("./data/session.json");
var ADAPTED_SESSION = require("./data/adaptedSession.json");
var BLOCKS = require("./data/blocks.json");
var ADAPTED_BLOCKS = require("./data/adaptedBlocks.json");

describe("viewDataAdapter", function() {

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

    it("adapts session for session page views", function() {
      var adaptedSession = viewDataAdapter.adaptSession(SESSION);

      expect(adaptedSession).to.deep.equal(ADAPTED_SESSION);
    });

  });

  describe("adaptBlocks", function() {

    it("adapts blocks for blocks page", function() {
      var adaptedBlocks = viewDataAdapter.adaptBlocks(BLOCKS);

      expect(adaptedBlocks).to.deep.equal(ADAPTED_BLOCKS);
    });

  });

});

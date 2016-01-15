var collectionViewDataAdapter = require("../src/data/collectionViewDataAdapter");
var PREVIEW_CATEGORIES = require("./data/previewCategories.json");
var ADAPTED_PREVIEW_CATEGORIES = require("./data/adaptedPreviewCategories.json");
var PLAY_CATEGORY = require("./data/playCategory.json");
var ADAPTED_PLAY_CATEGORY = require("./data/adaptedPlayCategory.json");

describe("collectionViewDataAdapter", function() {

  describe("adaptPreviewCategories", function() {

    it("adapts preview categories", function() {
      var adaptedPreviewCategories = collectionViewDataAdapter
        .adaptPreviewCategories(PREVIEW_CATEGORIES);

      expect(adaptedPreviewCategories).toEqual(ADAPTED_PREVIEW_CATEGORIES);
    });

  });

  describe("adaptCategory", function() {

    it("adapts category", function() {
      var adaptedPreviewCategories = collectionViewDataAdapter.adaptCategory(PLAY_CATEGORY);

      expect(adaptedPreviewCategories).toEqual(ADAPTED_PLAY_CATEGORY);
    });

  });

});

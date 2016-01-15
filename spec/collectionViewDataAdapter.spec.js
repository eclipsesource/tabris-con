var collectionViewDataAdapter = require("../src/data/collectionViewDataAdapter");
var PREVIEW_CATEGORIES = require("./data/previewCategories.json");
var ADAPTED_PREVIEW_CATEGORIES = require("./data/adaptedPreviewCategories.json");

describe("collectionViewDataAdapter", function() {

  describe("adaptPreviewCategories", function() {

    it("adapts preview categories for CollectionView data", function() {
      var adaptedPreviewCategories = collectionViewDataAdapter
        .adaptPreviewCategories(PREVIEW_CATEGORIES);

      expect(adaptedPreviewCategories).toEqual(ADAPTED_PREVIEW_CATEGORIES);
    });

  });

});

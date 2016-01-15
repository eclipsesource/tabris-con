var googleIODataExtractor = require("../src/data/googleIODataExtractor");
var IO_CONFERENCE_DATA = require("./data/ioConferenceData.json");
var PREVIEW_CATEGORIES = require("./data/previewCategories.json");

describe("googleIODataExtractor", function() {

  describe("extractCategoriesPreview", function() {

    it("extracts categories preview list from conference data", function() {
      var previewCategories = googleIODataExtractor.extractPreviewCategories(IO_CONFERENCE_DATA);

      expect(previewCategories).toEqual(PREVIEW_CATEGORIES);
    });

  });

});
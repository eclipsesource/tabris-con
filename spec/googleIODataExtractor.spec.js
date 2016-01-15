var googleIODataExtractor = require("../src/data/googleIODataExtractor");
var IO_CONFERENCE_DATA = require("./data/ioConferenceData.json");
var PREVIEW_CATEGORIES = require("./data/previewCategories.json");
var PLAY_CATEGORY = require("./data/playCategory.json");

describe("googleIODataExtractor", function() {

  describe("extractPreviewCategories", function() {
    it("extracts categories preview list from conference data", function() {
      var previewCategories = googleIODataExtractor.extractPreviewCategories(IO_CONFERENCE_DATA);

      expect(previewCategories).toEqual(PREVIEW_CATEGORIES);
    });
  });

  describe("extractCategory", function() {
    it("extracts category for a given tag", function() {
      var playCategory = googleIODataExtractor.extractCategory(IO_CONFERENCE_DATA, "TOPIC_PLAY");

      expect(playCategory).toEqual(PLAY_CATEGORY);
    });
  });

});
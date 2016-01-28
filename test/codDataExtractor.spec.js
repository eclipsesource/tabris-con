var expect = require("chai").expect;

var codDataExtractor = require("../src/data/codDataExtractor");
var COD_CONFERENCE_DATA = require("./data/cod/codConferenceData.json");
var PREVIEW_CATEGORIES = require("./data/cod/previewCategories.json");

describe("codDataExtractor", function() {

  describe("extractPreviewCategories", function() {
    it("extracts categories preview list from conference data", function() {
      var previewCategories = codDataExtractor.extractPreviewCategories(COD_CONFERENCE_DATA);

      expect(previewCategories).to.deep.equal(PREVIEW_CATEGORIES);
    });
  });

});
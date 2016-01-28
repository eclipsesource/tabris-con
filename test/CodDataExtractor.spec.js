var expect = require("chai").expect;

var CodDataExtractor = require("../src/data/CodDataExtractor");
var COD_CONFERENCE_DATA = require("./data/cod/codConferenceData.json");
var PREVIEW_CATEGORIES = require("./data/cod/previewCategories.json");
var OTHER_COOL_STUFF_CATEGORY = require("./data/cod/otherCoolStuffCategory.json");
var SESSION = require("./data/cod/session.json");

describe("CodDataExtractor", function() {

  var codDataExtractor;

  before(function() {
    var config = {
      DATA_FORMAT: "cod",
      CONFERENCE_TIMEZONE: "Europe/Berlin"
    };
    codDataExtractor = new CodDataExtractor(COD_CONFERENCE_DATA, config);
  });

  describe("extractPreviewCategories", function() {
    it("extracts categories preview list from conference data", function() {
      var previewCategories = codDataExtractor.extractPreviewCategories();

      expect(previewCategories).to.deep.equal(PREVIEW_CATEGORIES);
    });
  });

  describe("extractCategory", function() {
    it("extracts category for a given category", function() {
      var otherCoolStuffCategory = codDataExtractor.extractCategory("OTHER_COOL_STUFF");

      expect(otherCoolStuffCategory).to.deep.equal(OTHER_COOL_STUFF_CATEGORY);
    });
  });

  describe("extractSession", function() {
    it("extracts a session for a given ID", function() {
      var session = codDataExtractor.extractSession("20301046");

      expect(session).to.deep.equal(SESSION);
    });
  });

});
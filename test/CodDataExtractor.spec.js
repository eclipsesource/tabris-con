var expect = require("chai").expect;

var CodDataExtractor = require("../src/data/CodDataExtractor");
var COD_CONFERENCE_DATA = require("./data/cod/codConferenceData.json");
var PREVIEW_CATEGORIES = require("./data/cod/previewCategories.json");
var CATEGORIES = require("./data/cod/categories.json");
var SESSIONS = require("./data/cod/sessions.json");
var BLOCKS = require("./data/cod/blocks.json");

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
      var categories = codDataExtractor.extractCategories();

      expect(categories).to.deep.equal(CATEGORIES);
    });
  });

  describe("extractSession", function() {
    it("extracts a session for a given ID", function() {
      var sessions = codDataExtractor.extractSessions();

      expect(sessions).to.deep.equal(SESSIONS);
    });
  });

  describe("extractBlocks", function() {
    it("extracts conference blocks", function() {
      var blocks = codDataExtractor.extractBlocks();

      expect(blocks).to.deep.equal(BLOCKS);
    });
  });

});

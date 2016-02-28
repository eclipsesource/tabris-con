var expect = require("chai").expect;
var GoogleIODataExtractor = require("../src/GoogleIODataExtractor");
var IO_CONFERENCE_DATA = require("./json/googleIO/ioConferenceData.json");
var PREVIEW_CATEGORIES = require("./json/googleIO/previewCategories.json");
var CATEGORIES = require("./json/googleIO/categories.json");
var SESSIONS = require("./json/googleIO/sessions.json");
var BLOCKS = require("./json/googleIO/blocks.json");
var KEYNOTES = require("./json/googleIO/keynotes.json");

describe("googleIODataExtractor", function() {

  var googleIODataExtractor;

  before(function() {
    googleIODataExtractor = new GoogleIODataExtractor(IO_CONFERENCE_DATA);
  });

  describe("extractPreviewCategories", function() {
    it("extracts categories preview list from conference data", function() {
      var previewCategories = googleIODataExtractor.extractPreviewCategories();

      expect(previewCategories).to.deep.equal(PREVIEW_CATEGORIES);
    });
  });

  describe("extractCategory", function() {
    it("extracts category for a given tag", function() {
      var categories = googleIODataExtractor.extractCategories();

      expect(categories).to.deep.equal(CATEGORIES);
    });
  });

  describe("extractKeynotes", function() {
    it("extracts keynotes", function() {
      var keynotes = googleIODataExtractor.extractKeynotes();

      expect(keynotes).to.deep.equal(KEYNOTES);
    });
  });

  describe("extractSession", function() {
    it("extracts a session for a given ID", function() {
      var sessions = googleIODataExtractor.extractSessions();

      expect(sessions).to.deep.equal(SESSIONS);
    });
  });

  describe("extractBlocks", function() {
    it("extracts conference blocks", function() {
      var blocks = googleIODataExtractor.extractBlocks();

      expect(blocks).to.deep.equal(BLOCKS);
    });
  });

});

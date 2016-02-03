var mockery = require("mockery");
var expect = require("chai").expect;
var COD_CONFERENCE_DATA = require("./data/cod/codConferenceData.json");
var PREVIEW_CATEGORIES = require("./data/cod/previewCategories.json");
var CATEGORIES = require("./data/cod/categories.json");
var SESSIONS = require("./data/cod/sessions.json");
var BLOCKS = require("./data/cod/blocks.json");

describe("CodDataExtractor", function() {
  var codDataExtractor;
  var FAKE_CONFIG = {
    DATA_FORMAT: "cod",
    CONFERENCE_TIMEZONE: "Europe/Berlin",
    IGNORED_COD_BLOCKS: "^Dedicated"
  };

  before(function() {
    mockery.enable({useCleanCache: true, warnOnUnregistered: false});
    mockery.registerMock("../config", FAKE_CONFIG);
    mockery.registerMock("../../config", FAKE_CONFIG);
    var CodDataExtractor = require("../src/data/CodDataExtractor");
    codDataExtractor = new CodDataExtractor(COD_CONFERENCE_DATA);
  });

  after(function() {
    mockery.deregisterMock("../config");
    mockery.deregisterMock("../../config");
    mockery.disable();
  });

  describe("extractPreviewCategories", function() {
    it("extracts categories preview list", function() {
      var previewCategories = codDataExtractor.extractPreviewCategories();

      expect(previewCategories).to.deep.equal(PREVIEW_CATEGORIES);
    });
  });

  describe("extractCategories", function() {
    it("extracts all categories", function() {
      var categories = codDataExtractor.extractCategories();

      expect(categories).to.deep.equal(CATEGORIES);
    });
  });

  describe("extractSessions", function() {
    it("extracts all sessions", function() {
      var sessions = codDataExtractor.extractSessions();

      expect(sessions).to.deep.equal(SESSIONS);
    });
  });

  describe("extractBlocks", function() {
    it("extracts all conference blocks", function() {
      var blocks = codDataExtractor.extractBlocks();

      expect(blocks).to.deep.equal(BLOCKS);
    });
  });

});

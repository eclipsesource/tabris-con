var expect = require("chai").expect;
var googleIODataExtractor = require("../src/data/googleIODataExtractor");
var IO_CONFERENCE_DATA = require("./data/ioConferenceData.json");
var PREVIEW_CATEGORIES = require("./data/previewCategories.json");
var PLAY_CATEGORY = require("./data/playCategory.json");
var SESSION = require("./data/session.json");

describe("googleIODataExtractor", function() {

  describe("extractPreviewCategories", function() {
    it("extracts categories preview list from conference data", function() {
      var previewCategories = googleIODataExtractor.extractPreviewCategories(IO_CONFERENCE_DATA);

      expect(previewCategories).to.deep.equal(PREVIEW_CATEGORIES);
    });
  });

  describe("extractCategory", function() {
    it("extracts category for a given tag", function() {
      var playCategory = googleIODataExtractor.extractCategory(IO_CONFERENCE_DATA, "TOPIC_PLAY");

      expect(playCategory).to.deep.equal(PLAY_CATEGORY);
    });
  });

  describe("extractSession", function() {
    it("extracts a session for a given ID", function() {
      var session = googleIODataExtractor.extractSession(IO_CONFERENCE_DATA, "ee58a197-b6d4-e411-b87f-00155d5066d7");

      expect(session).to.deep.equal(SESSION);
    });
  });

});
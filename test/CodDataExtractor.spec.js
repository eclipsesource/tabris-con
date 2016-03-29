import {expect} from "chai";
import COD_CONFERENCE_DATA from "./json/cod/codConferenceData.json";
import PREVIEW_CATEGORIES from "./json/cod/previewCategories.json";
import CATEGORIES from "./json/cod/categories.json";
import KEYNOTES from "./json/cod/keynotes.json";
import SESSIONS from "./json/cod/sessions.json";
import BLOCKS from "./json/cod/blocks.json";
import CodDataExtractor from "../src/CodDataExtractor";

describe("CodDataExtractor", () => {
  let codDataExtractor;
  let CONFIG = {
    DATA_SOURCE: "codService",
    CONFERENCE_TIMEZONE: "Europe/Berlin",
    IGNORED_BLOCK_PATTERN: "^Dedicated"
  };

  before(() => {
    codDataExtractor = new CodDataExtractor(COD_CONFERENCE_DATA, CONFIG);
  });

  describe("extractPreviewCategories", () => {
    it("extracts categories preview list", () => {
      let previewCategories = codDataExtractor.extractPreviewCategories();

      expect(previewCategories).to.deep.equal(PREVIEW_CATEGORIES);
    });
  });

  describe("extractCategories", () => {
    it("extracts all categories", () => {
      let categories = codDataExtractor.extractCategories();

      expect(categories).to.deep.equal(CATEGORIES);
    });
  });

  describe("extractKeynotes", () => {
    it("extracts all keynotes", () => {
      let keynotes = codDataExtractor.extractKeynotes();

      expect(keynotes).to.deep.equal(KEYNOTES);
    });
  });

  describe("extractSessions", () => {
    it("extracts all sessions", () => {
      let sessions = codDataExtractor.extractSessions();

      expect(sessions).to.deep.equal(SESSIONS);
    });
  });

  describe("extractBlocks", () => {
    it("extracts all conference blocks", () => {
      let blocks = codDataExtractor.extractBlocks();

      expect(blocks).to.deep.equal(BLOCKS);
    });
  });

});

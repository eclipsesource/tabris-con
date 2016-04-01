import chai from "chai";
import GoogleIODataExtractor from "../src/GoogleIODataExtractor";
import IO_CONFERENCE_DATA from "./json/googleIO/ioConferenceData.json";
import PREVIEW_CATEGORIES from "./json/googleIO/previewCategories.json";
import SESSIONS from "./json/googleIO/sessions.json";
import BLOCKS from "./json/googleIO/blocks.json";
import KEYNOTES from "./json/googleIO/keynotes.json";

let expect = chai.expect;

describe("googleIODataExtractor", () => {

  let googleIODataExtractor;

  before(() => {
    googleIODataExtractor = new GoogleIODataExtractor(IO_CONFERENCE_DATA);
  });

  describe("extractPreviewCategories", () => {
    it("extracts categories preview list from conference data", () => {
      let previewCategories = googleIODataExtractor.extractPreviewCategories();

      expect(previewCategories).to.deep.equal(PREVIEW_CATEGORIES);
    });
  });

  describe("extractKeynotes", () => {
    it("extracts keynotes", () => {
      let keynotes = googleIODataExtractor.extractKeynotes();

      expect(keynotes).to.deep.equal(KEYNOTES);
    });
  });

  describe("extractSession", () => {
    it("extracts a session for a given ID", () => {
      let sessions = googleIODataExtractor.extractSessions();

      expect(sessions).to.deep.equal(SESSIONS);
    });
  });

  describe("extractBlocks", () => {
    it("extracts conference blocks", () => {
      let blocks = googleIODataExtractor.extractBlocks();

      expect(blocks).to.deep.equal(BLOCKS);
    });
  });

});

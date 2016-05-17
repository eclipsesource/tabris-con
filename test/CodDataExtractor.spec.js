import {expect} from "chai";
import COD_CONFERENCE_DATA from "./json/cod/codConferenceData.json";
import KEYNOTES from "./json/cod/keynotes.json";
import SESSIONS from "./json/cod/sessions.json";
import BLOCKS from "./json/cod/blocks.json";
import CodDataExtractor from "../src/CodDataExtractor";

describe("CodDataExtractor", () => {
  let codDataExtractor;
  let CONFIG = {
    DATA_TYPE: "cod",
    CONFERENCE_TIMEZONE: "Europe/Berlin",
    IGNORED_BLOCK_PATTERN: "^Dedicated"
  };

  before(() => {
    codDataExtractor = new CodDataExtractor(COD_CONFERENCE_DATA, CONFIG);
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

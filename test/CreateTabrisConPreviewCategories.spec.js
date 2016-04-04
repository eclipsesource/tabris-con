import chai from "chai";
import CreateTabrisConPreviewCategories from "../src/CreateTabrisConPreviewCategories.js";
import KEYNOTES from "./json/googleIO/keynotes.json";
import SESSIONS from "./json/googleIO/sessions.json";
import PREVIEW_CATEGORIES from "./json/googleIO/previewCategories.json";

let expect = chai.expect;

describe("CreateTabrisConPreviewCategories", () => {
  describe("fromSessionsAndKeynotes", () => {
    it("creates preview categories from sessions and keynotes", () => {
      let previewCategories = CreateTabrisConPreviewCategories.fromSessionsAndKeynotes(SESSIONS, KEYNOTES);

      expect(previewCategories).to.deep.equal(PREVIEW_CATEGORIES);
    });
  });
});

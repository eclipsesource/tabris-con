import chai from "chai";
import FilterTabrisConCategories from "../src/FilterTabrisConCategories";
import SESSIONS from "./json/cod/sessions.json";
import CATEGORIES from "./json/cod/categories.json";

let expect = chai.expect;

describe("FilterTabrisConCategories", () => {
  describe("fromSessions", () => {
    it("filters out categories from sessions list", () => {
      let fromSessions = FilterTabrisConCategories.fromSessions(SESSIONS);

      expect(fromSessions).to.deep.equal(CATEGORIES);
    });
  });
});

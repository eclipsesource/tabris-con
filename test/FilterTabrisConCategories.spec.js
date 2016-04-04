import chai from "chai";
import FilterTabrisConCategories from "../src/FilterTabrisConCategories";
import SESSIONS from "./json/cod/sessions.json";
import CATEGORIES from "./json/cod/categories.json";

let expect = chai.expect;

describe("FilterTabrisConCategories", () => {
  describe("fromSessions", () => {
    it("filters out categories from sessions list", () => {
      let categories = FilterTabrisConCategories.fromSessions(SESSIONS);

      expect(categories).to.deep.equal(CATEGORIES);
    });
    it("limits results", () => {
      let categories = FilterTabrisConCategories.fromSessions(SESSIONS, {sessionLimit: 1});

      expect(categories[0].sessions.length).to.equal(1);
    });
  });
});

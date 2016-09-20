import chai from "chai";
import sinon from "sinon";
import moment from "moment-timezone";
import PREVIEW_CATEGORIES from "./json/googleIO/previewCategories.json";
import ADAPTED_PREVIEW_CATEGORIES from "./json/googleIO/adaptedPreviewCategories.json";
import PLAY_CATEGORY from "./json/googleIO/playCategory.json";
import ADAPTED_PLAY_CATEGORY from "./json/googleIO/adaptedPlayCategory.json";
import KEYNOTE from "./json/googleIO/keynote.json";
import SESSION from "./json/googleIO/session.json";
import ADAPTED_SESSION from "./json/googleIO/adaptedSession.json";
import BLOCKS from "./json/googleIO/blocks.json";
import ADAPTED_BLOCKS from "./json/googleIO/adaptedBlocks.json";
import ADAPTED_KEYNOTE from "./json/googleIO/adaptedKeynote.json";
import ViewDataAdapter from "../src/ViewDataAdapter";

let expect = chai.expect;

let FAKE_CONFIG = {
  DATA_TYPE: "googleIO",
  SERVICES: {EVALUATION: "https://www.eclipsecon.org/na2016"},
  SESSIONS_HAVE_IMAGES: true,
  CONFERENCE_TIMEZONE: "America/Los_Angeles",
  CONFERENCE_SCHEDULE_HOUR_RANGE: [7, 8],
  SCHEDULE_PATTERN_ICON_MAP: {
    "^After": "schedule_icon_fun",
    "^Badge": "schedule_icon_badge",
    "^Pre-Keynote": "schedule_icon_session",
    ".*": "schedule_icon_food"
  }
};

describe("viewDataAdapter", () => {
  let viewDataAdapter;

  before(() => {
    global.window = sinon.stub();
    moment.locale("en-GB");
    viewDataAdapter = new ViewDataAdapter(FAKE_CONFIG);
  });

  describe("adaptPreviewCategories", () => {

    it("adapts preview categories for collection view", () => {
      localStorage.getItem = sinon.stub().returns("jsonDate");
      let adaptedPreviewCategories = viewDataAdapter
        .adaptPreviewCategories(PREVIEW_CATEGORIES);

      expect(adaptedPreviewCategories).to.deep.equal(ADAPTED_PREVIEW_CATEGORIES);
    });

  });

  describe("adaptCategory", () => {

    it("adapts category for collection view", () => {
      let adaptedPreviewCategories = viewDataAdapter.adaptCategory(PLAY_CATEGORY);

      expect(adaptedPreviewCategories).to.deep.equal(ADAPTED_PLAY_CATEGORY);
    });

  });

  describe("adaptSession", () => {

    it("adapts session for session page views", () => {
      global.screen = sinon.stub();
      screen.width = 360;
      screen.height = 642;

      let adaptedSession = viewDataAdapter.adaptSession(SESSION);

      expect(adaptedSession).to.deep.equal(ADAPTED_SESSION);
    });

  });

  describe("adaptKeynote", () => {

    it("adapts keynote for session page views", () => {
      let adaptedKeynote = viewDataAdapter.adaptKeynote(KEYNOTE);

      expect(adaptedKeynote).to.deep.equal(ADAPTED_KEYNOTE);
    });

  });

  describe("adaptBlocks", () => {

    it("adapts blocks for blocks page", () => {
      let adaptedBlocks = viewDataAdapter.adaptBlocks(BLOCKS);

      expect(adaptedBlocks).to.deep.equal(ADAPTED_BLOCKS);
    });

  });

});

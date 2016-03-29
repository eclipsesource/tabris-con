import chai from "chai";
import sinonChai from "sinon-chai";
import sinon from "sinon";
import {capitalizeFirstLetter} from "../src/helpers/stringUtility";
import * as persistedStorage from "../src/persistedStorage";

let expect = chai.expect;
chai.use(sinonChai);

describe("persisted storage", () => {
  beforeEach(() => {
    global.window = sinon.stub();
    global.localStorage = sinon.stub();
    global.localStorage.getItem = sinon.stub();
    global.localStorage.removeItem = sinon.stub();
    global.localStorage.setItem = sinon.spy();
  });

  describe("getAttendedSessions", () => {
    it("returns an empty array if no sessions are present", () => {
      global.localStorage.getItem.withArgs(persistedStorage.ATTENDED_SESSIONS).returns(null);

      let attendedBlocks = persistedStorage.getAttendedSessions();

      expect(attendedBlocks).to.deep.equal([]);
    });
  });

  describe("addAttendedSessionId", () => {
    it("adds chosen sessionId to localStorage", () => {
      persistedStorage.addAttendedSessionId("foo");

      let chosenItems = JSON.stringify(["foo"]);
      expect(localStorage.setItem).to.have.been.calledWith(persistedStorage.ATTENDED_SESSIONS, chosenItems);
    });

    it("adds more than one chosen sessionId to localStorage", () => {
      let presetItems = JSON.stringify(["foo"]);
      global.localStorage.getItem.withArgs(persistedStorage.ATTENDED_SESSIONS).returns(presetItems);

      persistedStorage.addAttendedSessionId("bar");

      let chosenItems = JSON.stringify(["foo", "bar"]);
      expect(localStorage.setItem).to.have.been.calledWith(persistedStorage.ATTENDED_SESSIONS, chosenItems);
    });

    it("doesn't add duplicates", () => {
      let presetItems = JSON.stringify(["foo"]);
      global.localStorage.getItem.withArgs(persistedStorage.ATTENDED_SESSIONS).returns(presetItems);

      persistedStorage.addAttendedSessionId("foo");

      let chosenItems = JSON.stringify(["foo"]);
      expect(localStorage.setItem).to.have.been.calledWith(persistedStorage.ATTENDED_SESSIONS, chosenItems);
    });
  });

  describe("removeAttendedBlock", () => {
    it("removes session id from localStorage", () => {
      let presetItems = JSON.stringify(["foo", "bar"]);
      global.localStorage.getItem.withArgs(persistedStorage.ATTENDED_SESSIONS).returns(presetItems);

      persistedStorage.removeAttendedSessionId("bar");

      let chosenItems = JSON.stringify(["foo"]);
      expect(localStorage.setItem).to.have.been.calledWith(persistedStorage.ATTENDED_SESSIONS, chosenItems);
    });

    it("doesn't fail if element does not exist", () => {
      persistedStorage.removeAttendedSessionId("foo");
    });
  });

  describe("set", () => {
    let properties = [
      persistedStorage.PREVIEW_CATEGORIES,
      persistedStorage.CATEGORIES,
      persistedStorage.SESSIONS,
      persistedStorage.KEYNOTES,
      persistedStorage.BLOCKS
    ];
    let value = {bak: "baz"};

    properties.forEach(property => {
      let capitalizedProperty = capitalizeFirstLetter(property);
      it("set" + capitalizedProperty + " stores " + property + " with data format in localStorage", () => {
        persistedStorage["set" + capitalizedProperty](value, "codService");

        expect(localStorage.setItem).to.have.been.calledWith(property, JSON.stringify({
          codService: value
        }));
      });
    });
  });

  describe("get", () => {
    let properties = [
      persistedStorage.PREVIEW_CATEGORIES,
      persistedStorage.CATEGORIES,
      persistedStorage.SESSIONS,
      persistedStorage.KEYNOTES,
      persistedStorage.BLOCKS
    ];

    properties.forEach(property => {
      let capitalizedProperty = capitalizeFirstLetter(property);
      it("get" + capitalizedProperty + " retrieves " + property + " with data format from localStorage", () => {
        global.localStorage.getItem.withArgs(property).returns(JSON.stringify({
          codService: {foo: "bar"},
          googleIOService: {baz: "bak"}
        }));

        let value = persistedStorage["get" + capitalizedProperty]("codService");

        expect(value).to.deep.equal({foo: "bar"});
      });
      it("get" + capitalizedProperty + " returns null if value not present", () => {
        let value = persistedStorage["get" + capitalizedProperty]();

        expect(value).to.equal(null);
      });
    });
  });

  describe("deleteConferenceData", () => {
    it("removes data from storage", () => {
      let properties = [
        persistedStorage.PREVIEW_CATEGORIES,
        persistedStorage.CATEGORIES,
        persistedStorage.SESSIONS,
        persistedStorage.KEYNOTES,
        persistedStorage.BLOCKS
      ];

      persistedStorage.removeConferenceData();

      properties.forEach(property =>  {
        expect(localStorage.removeItem).to.have.been.calledWith(property);
      });
    });
  });

});

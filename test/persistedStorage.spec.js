var persistedStorage = require("../src/data/persistedStorage");
var capitalizeFirstLetter = require("../src/stringUtility").capitalizeFirstLetter;

var chai = require("chai");
var expect = chai.expect;
var sinonChai = require("sinon-chai");
var sinon = require("sinon");
chai.use(sinonChai);

var CHOSEN_SESSIONS_STORAGE_KEY = persistedStorage.CHOSEN_SESSIONS_STORAGE_KEY;
var PREVIEW_CATEGORIES = persistedStorage.PREVIEW_CATEGORIES;
var CATEGORIES = persistedStorage.CATEGORIES;
var SESSIONS = persistedStorage.SESSIONS;
var BLOCKS = persistedStorage.BLOCKS;

describe("persisted storage", function() {

  beforeEach(function() {
    global.window = sinon.stub();
    global.localStorage = sinon.stub();
    global.localStorage.getItem = sinon.stub();
    global.localStorage.setItem = sinon.spy();
  });

  describe("getChosenSessions", function() {
    it("returns an empty array if no sessions are present", function() {
      global.localStorage.getItem.withArgs(CHOSEN_SESSIONS_STORAGE_KEY).returns(null);

      var chosenSessions = persistedStorage.getChosenSessions();

      expect(chosenSessions).to.deep.equal([]);
    });
  });

  describe("addChosenSessionId", function() {
    it("adds chosen sessionId to localStorage", function() {
      persistedStorage.addChosenSessionId("foo");

      var chosenItems = JSON.stringify(["foo"]);
      expect(localStorage.setItem).to.have.been.calledWith(CHOSEN_SESSIONS_STORAGE_KEY, chosenItems);
    });

    it("adds more than one chosen sessionId to localStorage", function() {
      var presetItems = JSON.stringify(["foo"]);
      global.localStorage.getItem.withArgs(CHOSEN_SESSIONS_STORAGE_KEY).returns(presetItems);

      persistedStorage.addChosenSessionId("bar");

      var chosenItems = JSON.stringify(["foo", "bar"]);
      expect(localStorage.setItem).to.have.been.calledWith(CHOSEN_SESSIONS_STORAGE_KEY, chosenItems);
    });

    it("doesn't add duplicates", function() {
      var presetItems = JSON.stringify(["foo"]);
      global.localStorage.getItem.withArgs(CHOSEN_SESSIONS_STORAGE_KEY).returns(presetItems);

      persistedStorage.addChosenSessionId("foo");

      var chosenItems = JSON.stringify(["foo"]);
      expect(localStorage.setItem).to.have.been.calledWith(CHOSEN_SESSIONS_STORAGE_KEY, chosenItems);
    });
  });

  describe("removeChosenSession", function() {
    it("removes session id from localStorage", function() {
      var presetItems = JSON.stringify(["foo", "bar"]);
      global.localStorage.getItem.withArgs(CHOSEN_SESSIONS_STORAGE_KEY).returns(presetItems);

      persistedStorage.removeChosenSessionId("bar");

      var chosenItems = JSON.stringify(["foo"]);
      expect(localStorage.setItem).to.have.been.calledWith(CHOSEN_SESSIONS_STORAGE_KEY, chosenItems);
    });

    it("doesn't fail if element does not exist", function() {
      persistedStorage.removeChosenSessionId("foo");
    });
  });

  describe("set", function() {
    var properties = [PREVIEW_CATEGORIES, CATEGORIES, SESSIONS, BLOCKS];
    var config = {DATA_FORMAT: "cod"};
    var value = {bak: "baz"};

    properties.forEach(function(property) {
      var capitalizedProperty = capitalizeFirstLetter(property);
      it("set" + capitalizedProperty + " stores " + property + " with data format in localStorage", function() {
        persistedStorage["set" + capitalizedProperty](config, value);

        expect(localStorage.setItem).to.have.been.calledWith(property, JSON.stringify({
          cod: value
        }));
      });
    });
  });

  describe("get", function() {
    var properties = [PREVIEW_CATEGORIES, CATEGORIES, SESSIONS, BLOCKS];
    var config = {DATA_FORMAT: "cod"};

    properties.forEach(function(property) {
      var capitalizedProperty = capitalizeFirstLetter(property);
      it("get" + capitalizedProperty + " retrieves " + property + " with data format from localStorage", function() {
        global.localStorage.getItem.withArgs(property).returns(JSON.stringify({
          cod: {foo: "bar"},
          googleIO: {baz: "bak"}
        }));

        var value = persistedStorage["get" + capitalizedProperty](config);

        expect(value).to.deep.equal({foo: "bar"});
      });
      it("get" + capitalizedProperty + " returns null if value not present", function() {
        var value = persistedStorage["get" + capitalizedProperty](config);

        expect(value).to.equal(null);
      });
    });
  });

});

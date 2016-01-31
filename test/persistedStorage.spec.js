var persistedStorage = require("../src/data/persistedStorage");
var capitalizeFirstLetter = require("../src/stringUtility").capitalizeFirstLetter;

var chai = require("chai");
var expect = chai.expect;
var sinonChai = require("sinon-chai");
var sinon = require("sinon");
chai.use(sinonChai);

var ATTENDED_BLOCK_STORAGE_KEY = persistedStorage.ATTENDED_BLOCK_STORAGE_KEY;
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

  describe("getAttendedBlocks", function() {
    it("returns an empty array if no sessions are present", function() {
      global.localStorage.getItem.withArgs(ATTENDED_BLOCK_STORAGE_KEY).returns(null);

      var attendedBlocks = persistedStorage.getAttendedBlocks();

      expect(attendedBlocks).to.deep.equal([]);
    });
  });

  describe("addAttendedBlockId", function() {
    it("adds chosen sessionId to localStorage", function() {
      persistedStorage.addAttendedBlockId("foo");

      var chosenItems = JSON.stringify(["foo"]);
      expect(localStorage.setItem).to.have.been.calledWith(ATTENDED_BLOCK_STORAGE_KEY, chosenItems);
    });

    it("adds more than one chosen sessionId to localStorage", function() {
      var presetItems = JSON.stringify(["foo"]);
      global.localStorage.getItem.withArgs(ATTENDED_BLOCK_STORAGE_KEY).returns(presetItems);

      persistedStorage.addAttendedBlockId("bar");

      var chosenItems = JSON.stringify(["foo", "bar"]);
      expect(localStorage.setItem).to.have.been.calledWith(ATTENDED_BLOCK_STORAGE_KEY, chosenItems);
    });

    it("doesn't add duplicates", function() {
      var presetItems = JSON.stringify(["foo"]);
      global.localStorage.getItem.withArgs(ATTENDED_BLOCK_STORAGE_KEY).returns(presetItems);

      persistedStorage.addAttendedBlockId("foo");

      var chosenItems = JSON.stringify(["foo"]);
      expect(localStorage.setItem).to.have.been.calledWith(ATTENDED_BLOCK_STORAGE_KEY, chosenItems);
    });
  });

  describe("removeAttendedBlock", function() {
    it("removes session id from localStorage", function() {
      var presetItems = JSON.stringify(["foo", "bar"]);
      global.localStorage.getItem.withArgs(ATTENDED_BLOCK_STORAGE_KEY).returns(presetItems);

      persistedStorage.removeAttendedBlockId("bar");

      var chosenItems = JSON.stringify(["foo"]);
      expect(localStorage.setItem).to.have.been.calledWith(ATTENDED_BLOCK_STORAGE_KEY, chosenItems);
    });

    it("doesn't fail if element does not exist", function() {
      persistedStorage.removeAttendedBlockId("foo");
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

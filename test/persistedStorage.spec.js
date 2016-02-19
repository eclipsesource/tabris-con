var capitalizeFirstLetter = require("../src/stringUtility").capitalizeFirstLetter;

var mockery = require("mockery");
var chai = require("chai");
var expect = chai.expect;
var sinonChai = require("sinon-chai");
var sinon = require("sinon");
chai.use(sinonChai);

describe("persisted storage", function() {
  var persistedStorage;

  before(function() {
    mockery.enable({useCleanCache: true, warnOnUnregistered: false});
    mockery.registerMock("../../config", {DATA_FORMAT: "cod"});
    persistedStorage = require("../src/data/persistedStorage");
  });

  beforeEach(function() {
    global.window = sinon.stub();
    global.localStorage = sinon.stub();
    global.localStorage.getItem = sinon.stub();
    global.localStorage.setItem = sinon.spy();
  });

  after(function() {
    mockery.deregisterMock("../../config");
    mockery.disable();
  });

  describe("getAttendedSessions", function() {
    it("returns an empty array if no sessions are present", function() {
      global.localStorage.getItem.withArgs(persistedStorage.ATTENDED_SESSION_STORAGE_KEY).returns(null);

      var attendedBlocks = persistedStorage.getAttendedSessions();

      expect(attendedBlocks).to.deep.equal([]);
    });
  });

  describe("addAttendedSessionId", function() {
    it("adds chosen sessionId to localStorage", function() {
      persistedStorage.addAttendedSessionId("foo");

      var chosenItems = JSON.stringify(["foo"]);
      expect(localStorage.setItem).to.have.been.calledWith(persistedStorage.ATTENDED_SESSION_STORAGE_KEY, chosenItems);
    });

    it("adds more than one chosen sessionId to localStorage", function() {
      var presetItems = JSON.stringify(["foo"]);
      global.localStorage.getItem.withArgs(persistedStorage.ATTENDED_SESSION_STORAGE_KEY).returns(presetItems);

      persistedStorage.addAttendedSessionId("bar");

      var chosenItems = JSON.stringify(["foo", "bar"]);
      expect(localStorage.setItem).to.have.been.calledWith(persistedStorage.ATTENDED_SESSION_STORAGE_KEY, chosenItems);
    });

    it("doesn't add duplicates", function() {
      var presetItems = JSON.stringify(["foo"]);
      global.localStorage.getItem.withArgs(persistedStorage.ATTENDED_SESSION_STORAGE_KEY).returns(presetItems);

      persistedStorage.addAttendedSessionId("foo");

      var chosenItems = JSON.stringify(["foo"]);
      expect(localStorage.setItem).to.have.been.calledWith(persistedStorage.ATTENDED_SESSION_STORAGE_KEY, chosenItems);
    });
  });

  describe("removeAttendedBlock", function() {
    it("removes session id from localStorage", function() {
      var presetItems = JSON.stringify(["foo", "bar"]);
      global.localStorage.getItem.withArgs(persistedStorage.ATTENDED_SESSION_STORAGE_KEY).returns(presetItems);

      persistedStorage.removeAttendedSessionId("bar");

      var chosenItems = JSON.stringify(["foo"]);
      expect(localStorage.setItem).to.have.been.calledWith(persistedStorage.ATTENDED_SESSION_STORAGE_KEY, chosenItems);
    });

    it("doesn't fail if element does not exist", function() {
      persistedStorage.removeAttendedSessionId("foo");
    });
  });

  describe("set", function() {
    var storage = require("../src/data/persistedStorage");
    var properties = [
      storage.PREVIEW_CATEGORIES,
      storage.CATEGORIES,
      storage.SESSIONS,
      storage.KEYNOTES,
      storage.BLOCKS
    ];
    var value = {bak: "baz"};

    properties.forEach(function(property) {
      var capitalizedProperty = capitalizeFirstLetter(property);
      it("set" + capitalizedProperty + " stores " + property + " with data format in localStorage", function() {
        persistedStorage["set" + capitalizedProperty](value);

        expect(localStorage.setItem).to.have.been.calledWith(property, JSON.stringify({
          cod: value
        }));
      });
    });
  });

  describe("get", function() {
    var storage = require("../src/data/persistedStorage");
    var properties = [
      storage.PREVIEW_CATEGORIES,
      storage.CATEGORIES,
      storage.SESSIONS,
      storage.KEYNOTES,
      storage.BLOCKS
    ];

    properties.forEach(function(property) {
      var capitalizedProperty = capitalizeFirstLetter(property);
      it("get" + capitalizedProperty + " retrieves " + property + " with data format from localStorage", function() {
        global.localStorage.getItem.withArgs(property).returns(JSON.stringify({
          cod: {foo: "bar"},
          googleIO: {baz: "bak"}
        }));

        var value = persistedStorage["get" + capitalizedProperty]();

        expect(value).to.deep.equal({foo: "bar"});
      });
      it("get" + capitalizedProperty + " returns null if value not present", function() {
        var value = persistedStorage["get" + capitalizedProperty]();

        expect(value).to.equal(null);
      });
    });
  });

});

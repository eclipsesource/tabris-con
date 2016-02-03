var mockery = require("mockery");
var chai = require("chai");
var expect = chai.expect;
var moment = require("moment-timezone");

describe("freeBlockInsertor", function() {
  var insertor;
  var FAKE_CONFIG = {
    DATA_FORMAT: "cod",
    CONFERENCE_TIMEZONE: "America/New_York",
    FREE_BLOCKS: {cod: [[date("07.03.2016 09:00"), date("07.03.2016 12:00")]]}
  };

  before(function() {
    mockery.enable({useCleanCache: true, warnOnUnregistered: false});
    mockery.registerMock("../../config", FAKE_CONFIG);
    insertor = require("../src/data/freeBlockInsertor");
  });

  after(function() {
    mockery.deregisterMock("../../config");
    mockery.disable();
  });

  it("returns input when FREE_BLOCKS not configured", function() {
    mockery.resetCache();
    mockery.deregisterMock("../../config");
    mockery.registerMock("../../config", {DATA_FORMAT: "cod", CONFERENCE_TIMEZONE: "America/New_York"});
    var insertor = require("../src/data/freeBlockInsertor");

    var inserted = insertor.insertIn("foo");

    expect(inserted).to.equal("foo");
    mockery.deregisterMock("../../config");
    mockery.registerMock("../../config", FAKE_CONFIG);
  });

  it("returns free blocks on empty array", function() {
    var blocks = insertor.insertIn([]);

    expect(blocks).to.deep.equal([{
      title: "BROWSE SESSIONS",
      sessionType: "free",
      startTimestamp: date("07.03.2016 09:00"),
      endTimestamp: date("07.03.2016 12:00")
    }]);
  });

  it("inserts blocks and returns a chronologically sorted list", function() {
    var blocks = insertor.insertIn([{startTimestamp: date("07.03.2016 08:00")}]);

    expect(blocks).to.deep.equal([
      {"startTimestamp": date("07.03.2016 08:00")},
      {
        title: "BROWSE SESSIONS",
        sessionType: "free",
        startTimestamp: date("07.03.2016 09:00"),
        endTimestamp: date("07.03.2016 12:00")
      }
    ]);
  });

  it("removes free blocks overlapping startTimestamp of an attended block", function() {
    var blocks = insertor.insertIn([{startTimestamp: date("07.03.2016 09:00")}]);

    expect(blocks).to.deep.equal([{"startTimestamp": date("07.03.2016 09:00")}]);
  });

  it("doesn't remove overlapping attended blocks", function() {
    var blocks = insertor.insertIn([
      {startTimestamp: date("07.03.2016 09:00")}, {startTimestamp: date("07.03.2016 09:00")}
    ]);

    expect(blocks).to.deep.equal([
      {startTimestamp: date("07.03.2016 09:00")}, {startTimestamp: date("07.03.2016 09:00")}
    ]);
  });

});

function date(simpleDate) {
  return moment.tz(simpleDate, "DD.MM.YYYY HH:mm", "America/New_York").toJSON();
}

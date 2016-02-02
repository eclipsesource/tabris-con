var FreeBlockInsertor = require("../src/data/FreeBlockInsertor");

var moment = require("moment-timezone");
var chai = require("chai");
var expect = chai.expect;

describe("FreeBlockInsertor", function() {
  var freeBlockInsertor;
  var appConfig = {
    CONFERENCE_TIMEZONE: "America/New_York",
    FREE_BLOCKS: [[dateToJSON("07.03.2016 09:00"), dateToJSON("07.03.2016 12:00")]]
  };

  beforeEach(function() {
    freeBlockInsertor = new FreeBlockInsertor(appConfig);
  });

  it("returns input when FREE_BLOCKS not configured", function() {
    var freeBlockInsertor = new FreeBlockInsertor({});

    var inserted = freeBlockInsertor.insertIn("foo");

    expect(inserted).to.equal("foo");
  });

  it("returns free blocks on empty array", function() {
    var blocks = freeBlockInsertor.insertIn([]);

    expect(blocks).to.deep.equal([{
      title: "BROWSE SESSIONS",
      sessionType: "free",
      startTimestamp: dateToJSON("07.03.2016 09:00"),
      endTimestamp: dateToJSON("07.03.2016 12:00")
    }]);
  });

  it("inserts blocks and returns a chronologically sorted list", function() {
    var blocks = freeBlockInsertor.insertIn([{startTimestamp: dateToJSON("07.03.2016 08:00")}]);

    expect(blocks).to.deep.equal([
      {"startTimestamp": dateToJSON("07.03.2016 08:00")},
      {
        title: "BROWSE SESSIONS",
        sessionType: "free",
        startTimestamp: dateToJSON("07.03.2016 09:00"),
        endTimestamp: dateToJSON("07.03.2016 12:00")
      }
    ]);
  });

  it("removes free blocks overlapping startTimestamp of an attended block", function() {
    var blocks = freeBlockInsertor.insertIn([{startTimestamp: dateToJSON("07.03.2016 09:00")}]);

    expect(blocks).to.deep.equal([{"startTimestamp": dateToJSON("07.03.2016 09:00")}]);
  });

  it("doesn't remove overlapping attended blocks", function() {
    var blocks = freeBlockInsertor.insertIn([
      {startTimestamp: dateToJSON("07.03.2016 09:00")}, {startTimestamp: dateToJSON("07.03.2016 09:00")}
    ]);

    expect(blocks).to.deep.equal([
      {startTimestamp: dateToJSON("07.03.2016 09:00")}, {startTimestamp: dateToJSON("07.03.2016 09:00")}
    ]);
  });

});

function dateToJSON(date) {
  return moment.tz(date, "DD.MM.YYYY HH:mm", "America/New_York").toJSON();
}

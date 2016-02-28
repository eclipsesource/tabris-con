var mockery = require("mockery");
var chai = require("chai");
var expect = chai.expect;
var moment = require("moment-timezone");

describe("getSessionFreeBlock", function() {
  var block1 = [date("07.03.2016 09:00"), date("07.03.2016 12:00")];
  var block2 = [date("07.03.2016 13:00"), date("07.03.2016 15:00")];
  var FAKE_CONFIG = {
    DATA_FORMAT: "cod",
    FREE_BLOCKS: {
      cod: [block1, block2]
    }
  };

  var getSessionFreeBlock;

  before(function() {
    mockery.enable({useCleanCache: true, warnOnUnregistered: false});
    mockery.registerMock("../config", FAKE_CONFIG);
    getSessionFreeBlock = require("../src/getSessionFreeBlock");
  });

  after(function() {
    mockery.deregisterMock("../config");
    mockery.disable();
  });

  it("returns block of session later than/starting at block start time", function() {
    var block = getSessionFreeBlock({startTimestamp: date("07.03.2016 09:00"), endTimestamp: date("07.03.2016 11:00")});

    expect(block).to.deep.equal(block1);
  });

  it("returns block of session earlier than/starting before block end time", function() {
    var block = getSessionFreeBlock({startTimestamp: date("07.03.2016 14:00"), endTimestamp: date("07.03.2016 15:00")});

    expect(block).to.deep.equal(block2);
  });

  it("returns 'null' if block not found", function() {
    var block = getSessionFreeBlock({startTimestamp: date("07.03.2016 09:00"), endTimestamp: date("07.03.2016 13:00")});

    expect(block).to.equal(null);
  });

});

function date(simpleDate) {
  return moment.tz(simpleDate, "DD.MM.YYYY HH:mm", "America/New_York").toJSON();
}

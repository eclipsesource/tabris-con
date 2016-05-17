import chai from "chai";
import moment from "moment-timezone";
import getSessionFreeBlock from "../src/getSessionFreeBlock";

let expect = chai.expect;

describe("getSessionFreeBlock", () => {
  let block1 = ["07.03.2016 09:00", "07.03.2016 12:00"];
  let block2 = ["07.03.2016 13:00", "07.03.2016 15:00"];

  let config = {
    CONFERENCE_TIMEZONE: "America/New_York", DATA_TYPE: "cod", FREE_BLOCKS: [block1, block2]
  };

  it("returns block of session later than/starting at block start time", () => {
    let block = getSessionFreeBlock(
      {startTimestamp: date("07.03.2016 09:00"), endTimestamp: date("07.03.2016 11:00")}, config
    );

    expect(block).to.deep.equal(block1);
  });

  it("returns block of session earlier than/starting before block end time", () => {
    let block = getSessionFreeBlock(
      {startTimestamp: date("07.03.2016 14:00"), endTimestamp: date("07.03.2016 15:00")}, config
    );

    expect(block).to.deep.equal(block2);
  });

  it("returns 'null' if block not found", () => {
    let block = getSessionFreeBlock(
      {startTimestamp: date("07.03.2016 09:00"), endTimestamp: date("07.03.2016 13:00")}, config
    );

    expect(block).to.equal(null);
  });

});

function date(simpleDate) {
  return moment.tz(simpleDate, "DD.MM.YYYY HH:mm", "America/New_York").toJSON();
}

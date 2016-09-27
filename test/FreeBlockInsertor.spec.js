import "./tabrisMock";
import chai from "chai";
import moment from "moment-timezone";
import FreeBlockInsertor from "../src/FreeBlockInsertor";

let expect = chai.expect;

describe("freeBlockInsertor", () => {
  let insertor;
  let config = {
    CONFERENCE_TIMEZONE: "America/New_York",
    DATA_TYPE: "cod",
    FREE_BLOCKS: [["07.03.2016 09:00", "07.03.2016 12:00"]]
  };

  before(() => {
    insertor = new FreeBlockInsertor(config);
  });

  it("returns input when FREE_BLOCKS not configured", () => {
    let inserted = new FreeBlockInsertor({CONFERENCE_TIMEZONE: "America/New_York"}).insert("foo");

    expect(inserted).to.equal("foo");
  });

  it("returns free blocks on empty array", () => {
    let blocks = insertor.insert([]);

    expect(blocks).to.deep.equal([{
      title: "BROWSE SESSIONS",
      blockType: "free",
      startTimestamp: date("07.03.2016 09:00"),
      endTimestamp: date("07.03.2016 12:00")
    }]);
  });

  it("inserts blocks and returns a chronologically sorted list", () => {
    let blocks = insertor.insert([{startTimestamp: date("07.03.2016 08:00")}]);

    expect(blocks).to.deep.equal([
      {"startTimestamp": date("07.03.2016 08:00")},
      {
        title: "BROWSE SESSIONS",
        blockType: "free",
        startTimestamp: date("07.03.2016 09:00"),
        endTimestamp: date("07.03.2016 12:00")
      }
    ]);
  });

  it("removes free blocks overlapping startTimestamp of an attended block", () => {
    let blocks = insertor.insert([{startTimestamp: date("07.03.2016 09:00")}]);

    expect(blocks).to.deep.equal([{"startTimestamp": date("07.03.2016 09:00")}]);
  });

  it("doesn't remove overlapping attended blocks", () => {
    let blocks = insertor.insert([
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

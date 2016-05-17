/* globals Promise: true */
import chai from "chai";
import "./tabrisMock";
import * as persistedStorage from "../src/persistedStorage";
import sinon from "sinon";
import AttendedBlockProvider from "../src/AttendedBlockProvider";
import conferenceDataProvider from "../src/ConferenceDataProvider";
import chaiAsPromised from "chai-as-promised";
import SESSIONS from "./json/cod/sessions.json";

let expect = chai.expect;
chai.use(chaiAsPromised);

describe("attendedBlockProvider", () => {
  let attendedBlockProvider = new AttendedBlockProvider(conferenceDataProvider);

  beforeEach(() => {
    global.window = sinon.stub();
    global.localStorage = sinon.stub();
    global.localStorage.getItem = sinon.stub();
    global.localStorage.setItem = sinon.spy();
    conferenceDataProvider.get = sinon.stub();
  });

  it("provides blocks referenced in localStorage", () => {
    let config = {DATA_TYPE: "cod", CONFERENCE_TIMEZONE: "Europe/Berlin"};
    global.localStorage.getItem.withArgs(persistedStorage.ATTENDED_SESSIONS).returns("[\"20301046\"]");
    conferenceDataProvider.get.returns(Promise.resolve({sessions: SESSIONS}));

    let blocks = attendedBlockProvider.getBlocks(config);

    expect(blocks).to.eventually.deep.equal([{
      sessionId: "20301046",
      title: "10 Java Idioms Stomped with Xtend",
      sessionNid: "2030",
      room: "Theater Stage",
      startTimestamp: "2015-11-05T09:30:00.000Z",
      endTimestamp: "2015-11-05T10:05:00.000Z"
    }]);
  });

});

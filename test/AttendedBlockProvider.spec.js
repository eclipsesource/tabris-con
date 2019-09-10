/* globals Promise: true */
import chai from "chai";
import "./tabrisMock";
import * as persistedStorage from "../src/persistedStorage";
import sinon from "sinon";
import AttendedBlockProvider from "../src/AttendedBlockProvider";
import chaiThings from "chai-things";
import {injector} from "tabris-decorators";
import ConferenceDataProvider from "../src/ConferenceDataProvider";

let expect = chai.expect;
chai.use(chaiThings);

describe("attendedBlockProvider", () => {

  let conferenceDataProvider, attendedBlockProvider;

  beforeEach(() => {
    injector.addHandler(ConferenceDataProvider, () => conferenceDataProvider);
    global.window = sinon.stub();
    global.localStorage = sinon.stub();
    global.localStorage.getItem = sinon.stub();
    global.localStorage.setItem = sinon.spy();
    global.localStorage.getItem.withArgs(persistedStorage.ATTENDED_SESSIONS).returns("[\"id\"]");
    conferenceDataProvider = {get: sinon.stub()};
    attendedBlockProvider = new AttendedBlockProvider();
  });

  it("provides blocks referenced in localStorage", function() {
    conferenceDataProvider.get.returns(Promise.resolve({
      sessions: [{id: "id"}, {id: "id2"}],
      keynotes: []
    }));

    return attendedBlockProvider.getBlocks().then(
      blocks => {
        expect(blocks).to.include.something.that.has.property("sessionId", "id");
        expect(blocks).not.to.include.something.that.has.property("sessionId", "id2");
      }
    );
  });

  it("provides preselected blocks", function() {
    conferenceDataProvider.get.returns(Promise.resolve({
      sessions: [{id: "id", concurrentSessions: 0}], keynotes: []
    }));

    return attendedBlockProvider.getBlocks().then(
      blocks => expect(blocks).to.include.something.that.has.property("sessionId", "id")
    );
  });

  it("maps properties", function() {
    conferenceDataProvider.get.returns(Promise.resolve({
      sessions: [{
        id: "id",
        nid: "nid",
        keynote: "keynote",
        concurrentSessions: 0,
        title: "title",
        room: "room",
        startTimestamp: "startTimestamp",
        endTimestamp: "endTimestamp"
      }], keynotes: []
    }));

    return attendedBlockProvider.getBlocks().then(
      blocks => {
        expect(blocks).to.include.something.that.has.property("sessionId", "id");
        expect(blocks).to.include.something.that.has.property("sessionNid", "nid");
        expect(blocks).to.include.something.that.has.property("keynote", "keynote");
        expect(blocks).to.include.something.that.has.property("concurrentSessions", 0);
        expect(blocks).to.include.something.that.has.property("title", "title");
        expect(blocks).to.include.something.that.has.property("room", "room");
        expect(blocks).to.include.something.that.has.property("startTimestamp", "startTimestamp");
        expect(blocks).to.include.something.that.has.property("endTimestamp", "endTimestamp");
      }
    );
  });

});

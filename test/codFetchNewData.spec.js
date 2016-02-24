/*jshint expr: true*/
/* globals fetch: true, Promise: true*/
var chai = require("chai");
var expect = chai.expect;
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
fetch = require("node-fetch");
var fetchMock = require("fetch-mock");
Promise = require("promise");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.use(sinonChai);
var codFetchNewData = require("../src/data/codFetchNewData");

var SCHEDULED_SESSIONS_SERVICE = "https://www.eclipsecon.org/na2016/api/1.0/eclipsecon_scheduled_sessions";

describe("codFetchNewData", function() {
  beforeEach(function() {
    global.window = sinon.stub();
    global.localStorage = sinon.stub();
    global.localStorage.getItem = sinon.stub();
    global.localStorage.setItem = sinon.spy();
    global.localStorage.getItem.withArgs("codScheduledSessionsLastModified").returns("lastmodified");
    global.localStorage.getItem.withArgs("codScheduledSessionsETag").returns("etag");
  });

  afterEach(function() {
    fetchMock.restore();
  });

  it("returns response body when status 200", function() {
    fetchMock.mock(SCHEDULED_SESSIONS_SERVICE, {});

    return codFetchNewData()
      .then(function(data) {
        expect(fetchMock.called(SCHEDULED_SESSIONS_SERVICE)).to.be.true;
        expect(data).to.deep.equal({scheduledSessions: {}});
      });
  });

  it("calls service with cache control headers", function() {
    fetchMock.mock(SCHEDULED_SESSIONS_SERVICE, {});

    return codFetchNewData()
      .then(function() {
        expect(fetchMock.lastOptions(SCHEDULED_SESSIONS_SERVICE).headers).to.deep.equal({
          "If-None-Match": "etag",
          "If-Modified-Since": "lastmodified"
        });
      });
  });

  it("saves response etag and last-modified when status 200", function() {
    fetchMock.mock(SCHEDULED_SESSIONS_SERVICE, {headers: {etag: "foo", "last-modified": "bar"}, body: {}});

    return codFetchNewData()
      .then(function(data) {
        expect(fetchMock.called(SCHEDULED_SESSIONS_SERVICE)).to.be.true;
        expect(data).to.deep.equal({scheduledSessions: {}});
        expect(localStorage.setItem).to.have.been.calledWith("codScheduledSessionsLastModified", "bar");
        expect(localStorage.setItem).to.have.been.calledWith("codScheduledSessionsETag", "foo");
      });
  });

  it("returns 'null' when status === 304", function() {
    fetchMock.mock(SCHEDULED_SESSIONS_SERVICE, {status: 304, body: {}});

    return codFetchNewData()
      .then(function(data) {
        expect(fetchMock.called(SCHEDULED_SESSIONS_SERVICE)).to.be.true;
        expect(data).to.deep.equal(null);
      });
  });

  it("rejects if status unexpected", function() {
    fetchMock.mock(SCHEDULED_SESSIONS_SERVICE, {status: 500, body: {}});

    return expect(codFetchNewData()).to.eventually.be.rejected;
  });

});

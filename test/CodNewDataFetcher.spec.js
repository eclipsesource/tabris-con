/*jshint expr: true*/
import chai from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import "node-fetch";
import fetchMock from "fetch-mock";
import chaiAsPromised from "chai-as-promised";
import CodNewDataFetcher from "../src/CodNewDataFetcher";

let expect = chai.expect;

chai.use(chaiAsPromised);
chai.use(sinonChai);

let SCHEDULED_SESSIONS_SERVICE = "https://www.eclipsecon.org/na2016/api/1.0/eclipsecon_scheduled_sessions";

describe("CodNewDataFetcher", () => {
  let CONFIG = {SERVICE_URL: "https://www.eclipsecon.org/na2016"};
  let codNewDataFetcher = new CodNewDataFetcher(CONFIG);

  beforeEach(() => {
    global.window = sinon.stub();
    global.localStorage = sinon.stub();
    global.localStorage.getItem = sinon.stub();
    global.localStorage.setItem = sinon.spy();
    global.localStorage.getItem.withArgs("codScheduledSessionsLastModified").returns("lastmodified");
    global.localStorage.getItem.withArgs("codScheduledSessionsETag").returns("etag");
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it("returns response body when status 200", () => {
    fetchMock.mock(SCHEDULED_SESSIONS_SERVICE, {});

    return codNewDataFetcher.fetch()
      .then(data => {
        expect(fetchMock.called(SCHEDULED_SESSIONS_SERVICE)).to.be.true;
        expect(data).to.deep.equal({scheduledSessions: {}});
      });
  });

  it("calls service with cache control headers", () => {
    fetchMock.mock(SCHEDULED_SESSIONS_SERVICE, {});

    return codNewDataFetcher.fetch()
      .then(() => {
        expect(fetchMock.lastOptions(SCHEDULED_SESSIONS_SERVICE).headers).to.deep.equal({
          "If-None-Match": "etag",
          "If-Modified-Since": "lastmodified"
        });
      });
  });

  it("saves response etag and last-modified when status 200", () => {
    fetchMock.mock(SCHEDULED_SESSIONS_SERVICE, {headers: {etag: "foo", "last-modified": "bar"}, body: {}});

    return codNewDataFetcher.fetch()
      .then(data => {
        expect(fetchMock.called(SCHEDULED_SESSIONS_SERVICE)).to.be.true;
        expect(data).to.deep.equal({scheduledSessions: {}});
        expect(localStorage.setItem).to.have.been.calledWith("codScheduledSessionsLastModified", "bar");
        expect(localStorage.setItem).to.have.been.calledWith("codScheduledSessionsETag", "foo");
      });
  });

  it("returns 'null' when status === 304", () => {
    fetchMock.mock(SCHEDULED_SESSIONS_SERVICE, {status: 304, body: {}});

    return codNewDataFetcher.fetch()
      .then(data => {
        expect(fetchMock.called(SCHEDULED_SESSIONS_SERVICE)).to.be.true;
        expect(data).to.deep.equal(null);
      });
  });

  it("rejects if status unexpected", () => {
    fetchMock.mock(SCHEDULED_SESSIONS_SERVICE, {status: 500, body: {}});

    return expect(codNewDataFetcher.fetch()).to.eventually.be.rejected;
  });

});

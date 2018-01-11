import chai from "chai";
import "promise.prototype.finally";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import "node-fetch";
import fetchMock from "fetch-mock";
import chaiAsPromised from "chai-as-promised";
import NewDataFetcher from "../src/NewDataFetcher";

let expect = chai.expect;

chai.use(chaiAsPromised);
chai.use(sinonChai);

let SESSIONS = "https://www.eclipsecon.org/na2016/api/1.0/eclipsecon_scheduled_sessions";

describe("NewDataFetcher", () => {
  let CONFIG = {SERVICES: {SESSIONS}, DATA_TYPE: "cod"};
  let fetcher = new NewDataFetcher(CONFIG);

  beforeEach(() => {
    global.window = sinon.stub();
    global.localStorage = sinon.stub();
    global.localStorage.getItem = sinon.stub();
    global.localStorage.setItem = sinon.spy();
    global.localStorage.getItem.withArgs(fetcher.ETAG_LOCAL_STORAGE_KEY).returns("etag");
    global.localStorage.getItem.withArgs(fetcher.LAST_MODIFIED_LOCAL_STORAGE_KEY).returns("lastmodified");
  });

  afterEach(() => {
    fetchMock.restore();
  });

  it("returns response body when status 200", () => {
    fetchMock.mock(SESSIONS, {});

    return fetcher.fetch()
      .then(data => {
        expect(fetchMock.called(SESSIONS)).to.be.true;
        expect(data).to.deep.equal({scheduledSessions: {}});
      });
  });

  it("calls service with cache control headers", () => {
    fetchMock.mock(SESSIONS, {});

    return fetcher.fetch()
      .then(() => {
        expect(fetchMock.lastOptions(SESSIONS).headers).to.deep.equal({
          "If-None-Match": "etag",
          "If-Modified-Since": "lastmodified"
        });
      });
  });

  it("saves response etag and last-modified when status 200", () => {
    fetchMock.mock(SESSIONS, {headers: {etag: "foo", "last-modified": "bar"}, body: {}});

    return fetcher.fetch()
      .then(data => {
        expect(fetchMock.called(SESSIONS)).to.be.true;
        expect(data).to.deep.equal({scheduledSessions: {}});
        expect(localStorage.setItem).to.have.been.calledWith(fetcher.ETAG_LOCAL_STORAGE_KEY, "foo");
        expect(localStorage.setItem).to.have.been.calledWith(fetcher.LAST_MODIFIED_LOCAL_STORAGE_KEY, "bar");
      });
  });

  it("returns 'null' when status === 304", () => {
    fetchMock.mock(SESSIONS, {status: 304, body: {}});

    return fetcher.fetch()
      .then(data => {
        expect(fetchMock.called(SESSIONS)).to.be.true;
        expect(data).to.deep.equal(null);
      });
  });

  it("rejects if status unexpected", () => {
    fetchMock.mock(SESSIONS, {status: 500, body: {}});

    return expect(fetcher.fetch()).to.eventually.be.rejected;
  });

  it("doesn't call service more than once if fetch is already taking place", () => {
    fetchMock.mock(SESSIONS, {});

    Promise.all([fetcher.fetch(), fetcher.fetch()]).then(() => {
      expect(fetchMock.calls().length).to.equal(1);
    });
  });

});

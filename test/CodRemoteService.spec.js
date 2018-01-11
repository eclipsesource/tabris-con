import chai from "chai";
import sinonChai from "sinon-chai";
import fetchMock from "fetch-mock";
import chaiAsPromised from "chai-as-promised";
import CodRemoteService from "../src/CodRemoteService";

let expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sinonChai);

describe("codRemoteService", () => {
  let codRemoteService;
  let loginService = {destroySession: () => {}};
  let SERVICES = {
    SESSIONS: "https://foo.com/sessions",
    LOGIN: "https://foo.com/login",
    CSRF_TOKEN: "https://foo.com/token",
    LOGOUT: "https://foo.com/logout",
    EVALUATIONS: "https://foo.com/logout"
  };
  beforeEach(() => codRemoteService = new CodRemoteService(SERVICES, loginService));
  afterEach(() => fetchMock.restore());

  describe("login", () => {
    it("sends login request to service", () => {
      fetchMock.mock(SERVICES.CSRF_TOKEN, "token");
      fetchMock.mock(SERVICES.LOGIN, {});

      return codRemoteService.login("foo", "bar")
        .then(response => {
          expect(fetchMock.called(SERVICES.CSRF_TOKEN)).to.be.true;
          expect(fetchMock.called(SERVICES.LOGIN)).to.be.true;
          expect(fetchMock.lastCall()[1].method).to.equal("post");
          expect(fetchMock.lastCall()[1].headers).to.deep.equal({
            Accept: "application/json", "Content-Type": "application/json", "X-CSRF-Token": "token"
          });
          expect(fetchMock.lastCall()[1].body).to.deep.equal(JSON.stringify({username: "foo", password: "bar"}));
          expect(response).to.deep.equal({});
        });
    });

    it("rejects when response is an array (error)", () => {
      fetchMock.mock(SERVICES.CSRF_TOKEN, "token");
      fetchMock.mock(SERVICES.LOGIN, ["foo"]);

      let loginPromise = codRemoteService.login("foo", "bar");

      return expect(loginPromise).to.eventually.be.rejected;
    });
  });

  describe("logout", () => {
    it("sends logout request", () => {
      fetchMock.mock(SERVICES.CSRF_TOKEN, "token");
      fetchMock.mock(SERVICES.LOGOUT, [true]);

      return codRemoteService.logout()
        .then(response => {
          expect(fetchMock.called(SERVICES.CSRF_TOKEN)).to.be.true;
          expect(fetchMock.called(SERVICES.LOGOUT)).to.be.true;
          expect(fetchMock.lastCall()[1].method).to.equal("post");
          expect(fetchMock.lastCall()[1].headers).to.deep.equal({
            Accept: "application/json", "Content-Type": "application/json", "X-CSRF-Token": "token"
          });
          expect(response).to.deep.equal([true]);
        });
    });

    it("rejects when response is not [true]", () => {
      fetchMock.mock(SERVICES.CSRF_TOKEN, "token");
      fetchMock.mock(SERVICES.LOGOUT, ["foo"]);

      let logoutPromise = codRemoteService.logout();

      return expect(logoutPromise).to.eventually.be.rejected;
    });

    it("doesn't reject when cookie expired", () => {
      fetchMock.mock(SERVICES.CSRF_TOKEN, "token");
      fetchMock.mock(SERVICES.LOGOUT, ["User is not logged in."]);

      let logoutPromise = codRemoteService.logout();

      return expect(logoutPromise).eventually.not.to.be.rejected;
    });
  });

  describe("csrfToken", () => {
    it("sends csrf token request", () => {
      fetchMock.mock(SERVICES.CSRF_TOKEN, "token");

      let tokenPromise = codRemoteService.csrfToken();

      expect(fetchMock.called(SERVICES.CSRF_TOKEN)).to.be.true;
      return expect(tokenPromise).to.eventually.equal("token");
    });
  });

  describe("evaluations", () => {
    it("returns a list of evaluations", () => {
      fetchMock.mock(SERVICES.EVALUATIONS, [{nid: "200"}]);

      let evaluations = codRemoteService.evaluations();

      expect(fetchMock.called(SERVICES.EVALUATIONS)).to.be.true;
      return expect(evaluations).to.eventually.deep.equal([{nid: "200"}]);
    });

    it("fails when response is an error", () => {
      fetchMock.mock(SERVICES.EVALUATIONS, ["User is not logged in."]);

      let evaluations = codRemoteService.evaluations();

      return expect(evaluations).to.eventually.be.rejectedWith(/User is not logged in/);
    });
  });

  describe("createEvaluation", () => {
    it("fails when evaluation is already submitted", () => {
      fetchMock.mock(SERVICES.EVALUATIONS, [{nid: "200"}]);

      let evaluation = codRemoteService.createEvaluation("200", "foo");

      return expect(evaluation).to.eventually.be.rejectedWith(/already submitted/);
    });

    it("fails when server responds with an error", () => {
      fetchMock.mock(SERVICES.EVALUATIONS, "GET", [{nid: "300"}]);
      fetchMock.mock(SERVICES.EVALUATIONS, "POST", ["error"]);
      fetchMock.mock(SERVICES.CSRF_TOKEN, "token");

      let evaluation = codRemoteService.createEvaluation("200", "foo");

      return expect(evaluation).to.eventually.be.rejectedWith("error");
    });

    it("fails when server sends an unexpected response", () => {
      fetchMock.mock(SERVICES.EVALUATIONS, "GET", [{nid: "300"}]);
      fetchMock.mock(SERVICES.EVALUATIONS, "POST", {foo: "bar"});
      fetchMock.mock(SERVICES.CSRF_TOKEN, "token");

      let evaluation = codRemoteService.createEvaluation("200", "foo");

      return expect(evaluation).to.eventually.be.rejectedWith("Could not submit evaluation.");
    });

    it("creates an evaluation", () => {
      let evaluationResponse = {nid: "200"};
      fetchMock.mock(SERVICES.EVALUATIONS, "GET", [{nid: "300"}]);
      fetchMock.mock(SERVICES.EVALUATIONS, "POST", evaluationResponse);
      fetchMock.mock(SERVICES.CSRF_TOKEN, "token");

      return codRemoteService.createEvaluation("200", "foo", "+1").then(response => {
        expect(response).to.deep.equal(evaluationResponse);
        let body = JSON.parse(fetchMock.lastCall()[1].body);
        expect(body.session_id).to.equal("200");
        expect(body.comment).to.equal("foo");
        expect(body.rating).to.equal("+1");
      });
    });
  });

});

/*jshint expr: true*/
/* globals fetch: true, Promise: true*/
var chai = require("chai");
var expect = chai.expect;
var sinonChai = require("sinon-chai");
fetch = require("node-fetch");
var fetchMock = require("fetch-mock");
Promise = require("promise");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.use(sinonChai);
var codRemoteService = require("../src/codRemoteService");

describe("codRemoteService", function() {
  afterEach(function() {
    fetchMock.restore();
  });

  describe("login", function() {
    it("sends login request to service", function() {
      fetchMock.mock("https://www.eclipsecon.org/na2016/services/session/token", "token");
      fetchMock.mock("https://www.eclipsecon.org/na2016/api/1.0/user/login", {});

      return codRemoteService.login("foo", "bar")
        .then(function(response) {
          expect(fetchMock.called("https://www.eclipsecon.org/na2016/services/session/token")).to.be.true;
          expect(fetchMock.called("https://www.eclipsecon.org/na2016/api/1.0/user/login")).to.be.true;
          expect(fetchMock.lastCall()[1].method).to.equal("post");
          expect(fetchMock.lastCall()[1].headers).to.deep.equal({
            Accept: "application/json", "Content-Type": "application/json", "X-CSRF-Token": "token"
          });
          expect(fetchMock.lastCall()[1].body).to.deep.equal(JSON.stringify({name: "foo", pass: "bar"}));
          expect(response).to.deep.equal({});
        });
    });

    it("rejects when response is an array (error)", function() {
      fetchMock.mock("https://www.eclipsecon.org/na2016/services/session/token", "token");
      fetchMock.mock("https://www.eclipsecon.org/na2016/api/1.0/user/login", ["foo"]);

      var loginPromise = codRemoteService.login("foo", "bar");

      return expect(loginPromise).to.eventually.be.rejected;
    });
  });

  describe("logout", function() {
    it("sends logout request", function() {
      fetchMock.mock("https://www.eclipsecon.org/na2016/services/session/token", "token");
      fetchMock.mock("https://www.eclipsecon.org/na2016/api/1.0/user/logout", [true]);

      return codRemoteService.logout()
        .then(function(response) {
          expect(fetchMock.called("https://www.eclipsecon.org/na2016/services/session/token")).to.be.true;
          expect(fetchMock.called("https://www.eclipsecon.org/na2016/api/1.0/user/logout")).to.be.true;
          expect(fetchMock.lastCall()[1].method).to.equal("post");
          expect(fetchMock.lastCall()[1].headers).to.deep.equal({
            Accept: "application/json", "Content-Type": "application/json", "X-CSRF-Token": "token"
          });
          expect(response).to.deep.equal([true]);
        });
    });

    it("rejects when response is not [true]", function() {
      fetchMock.mock("https://www.eclipsecon.org/na2016/services/session/token", "token");
      fetchMock.mock("https://www.eclipsecon.org/na2016/api/1.0/user/logout", ["foo"]);

      var logoutPromise = codRemoteService.logout();

      return expect(logoutPromise).to.eventually.be.rejected;
    });

    it("doesn't reject when cookie expired", function() {
      fetchMock.mock("https://www.eclipsecon.org/na2016/services/session/token", "token");
      fetchMock.mock("https://www.eclipsecon.org/na2016/api/1.0/user/logout", ["User is not logged in."]);

      var logoutPromise = codRemoteService.logout();

      return expect(logoutPromise).eventually.not.to.be.rejected;
    });
  });

  describe("csrfToken", function() {
    it("sends csrf token request", function() {
      fetchMock.mock("https://www.eclipsecon.org/na2016/services/session/token", "token");

      var tokenPromise = codRemoteService.csrfToken();

      expect(fetchMock.called("https://www.eclipsecon.org/na2016/services/session/token")).to.be.true;
      return expect(tokenPromise).to.eventually.equal("token");
    });
  });

  describe("evaluations", function() {
    it("returns a list of evaluations", function() {
      fetchMock.mock("https://www.eclipsecon.org/na2016/api/1.0/eclipsecon_evaluations", [{nid: "200"}]);

      var evaluations = codRemoteService.evaluations();

      expect(fetchMock.called("https://www.eclipsecon.org/na2016/api/1.0/eclipsecon_evaluations")).to.be.true;
      return expect(evaluations).to.eventually.deep.equal([{nid: "200"}]);
    });

    it("fails when response is an error", function() {
      fetchMock.mock("https://www.eclipsecon.org/na2016/api/1.0/eclipsecon_evaluations", ["User is not logged in."]);

      var evaluations = codRemoteService.evaluations();

      return expect(evaluations).to.eventually.be.rejectedWith(/User is not logged in/);
    });
  });

  describe("createEvaluation", function() {
    it("fails when evaluation is already submitted", function() {
      fetchMock.mock("https://www.eclipsecon.org/na2016/api/1.0/eclipsecon_evaluations", [{nid: "200"}]);

      var evaluation = codRemoteService.createEvaluation("200", "foo");

      return expect(evaluation).to.eventually.be.rejectedWith(/already submitted/);
    });

    it("fails when server responds with an error", function() {
      fetchMock.mock("https://www.eclipsecon.org/na2016/api/1.0/eclipsecon_evaluations", "GET", [{nid: "300"}]);
      fetchMock.mock("https://www.eclipsecon.org/na2016/api/1.0/eclipsecon_evaluations", "POST", ["error"]);
      fetchMock.mock("https://www.eclipsecon.org/na2016/services/session/token", "token");

      var evaluation = codRemoteService.createEvaluation("200", "foo");

      return expect(evaluation).to.eventually.be.rejectedWith("error");
    });

    it("fails when server sends an unexpected response", function() {
      fetchMock.mock("https://www.eclipsecon.org/na2016/api/1.0/eclipsecon_evaluations", "GET", [{nid: "300"}]);
      fetchMock.mock("https://www.eclipsecon.org/na2016/api/1.0/eclipsecon_evaluations", "POST", {foo: "bar"});
      fetchMock.mock("https://www.eclipsecon.org/na2016/services/session/token", "token");

      var evaluation = codRemoteService.createEvaluation("200", "foo");

      return expect(evaluation).to.eventually.be.rejectedWith("Could not submit evaluation.");
    });

    it("creates an evaluation", function() {
      var evaluationResponse = {nid: "200", uri: "https://www.eclipsecon.org/na2016/api/1.0/node/200"};
      fetchMock.mock("https://www.eclipsecon.org/na2016/api/1.0/eclipsecon_evaluations", "GET", [{nid: "300"}]);
      fetchMock.mock("https://www.eclipsecon.org/na2016/api/1.0/eclipsecon_evaluations", "POST", evaluationResponse);
      fetchMock.mock("https://www.eclipsecon.org/na2016/services/session/token", "token");

      return codRemoteService.createEvaluation("200", "foo", "+1").then(function(response) {
        expect(response).to.deep.equal(evaluationResponse);
        var body = JSON.parse(fetchMock.lastCall()[1].body);
        expect(body.session_id).to.equal("200");
        expect(body.comment).to.equal("foo");
        expect(body.rating).to.equal("+1");
      });
    });
  });

});

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
          return expect(response).to.deep.equal([true]);
        });
    });

    it("rejects when response is not [true]", function() {
      fetchMock.mock("https://www.eclipsecon.org/na2016/services/session/token", "token");
      fetchMock.mock("https://www.eclipsecon.org/na2016/api/1.0/user/logout", ["foo"]);

      var logoutPromise = codRemoteService.logout();

      return expect(logoutPromise).to.eventually.be.rejected;
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
});

var squash = require("../src/data/squash");
var chai = require("chai");
var expect = chai.expect;

describe("squash", function() {
  it("returns empty target", function() {
    var target = [];

    var squashed = squash(target, "id", {aggregatee: "baz", separator: ", "});

    expect(squashed).to.deep.equal([]);
  });

  it("doesn't aggregate items which don't match the predicate", function() {
    var target = [{"id": "bar", "baz": "foo"}, {"id": "bap", "baz": "dar"}];

    var squashed = squash(target, "id", {aggregatee: "baz", separator: ", "});

    expect(squashed).to.deep.equal([{"id": "bar", "baz": "foo"}, {"id": "bap", "baz": "dar"}]);
  });

  describe("duplicate items", function() {

    it("get aggregated matching predicate string", function() {
      var target = [{"id": "bar", "baz": "foo"}, {"id": "bar", "baz": "dar"}];

      var squashed = squash(target, "id", {aggregatee: "baz", separator: ", "});

      expect(squashed).to.deep.equal([{"id": "bar", "baz": "foo, dar"}]);
    });

    it("get aggregated matching predicate function", function() {
      var target = [{"id": "bar", "baz": "foo"}, {"id": "bar", "baz": "dar"}];

      var squashed = squash(target, function(obj) {return obj.id;}, {aggregatee: "baz", separator: ", "});

      expect(squashed).to.deep.equal([{"id": "bar", "baz": "foo, dar"}]);
    });

    it("don't contain duplicate aggregated values", function() {
      var target = [{"id": "bar", "baz": "foo bar"}, {"id": "bar", "baz": "foo bar"}];

      var squashed = squash(target, "id", {aggregatee: "baz", separator: ", "});

      expect(squashed[0].baz).to.equal("foo bar");
    });
  });

});

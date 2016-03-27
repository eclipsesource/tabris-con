import squash from "../src/squash";
import chai from "chai";

let expect = chai.expect;

describe("squash", () => {
  it("returns empty target", () => {
    let target = [];

    let squashed = squash(target, "id", {aggregatee: "baz", separator: ", "});

    expect(squashed).to.deep.equal([]);
  });

  it("doesn't aggregate items which don't match the predicate", () => {
    let target = [{"id": "bar", "baz": "foo"}, {"id": "bap", "baz": "dar"}];

    let squashed = squash(target, "id", {aggregatee: "baz", separator: ", "});

    expect(squashed).to.deep.equal([{"id": "bar", "baz": "foo"}, {"id": "bap", "baz": "dar"}]);
  });

  describe("duplicate items", () => {

    it("get aggregated matching predicate string", () => {
      let target = [{"id": "bar", "baz": "foo"}, {"id": "bar", "baz": "dar"}];

      let squashed = squash(target, "id", {aggregatee: "baz", separator: ", "});

      expect(squashed).to.deep.equal([{"id": "bar", "baz": "foo, dar"}]);
    });

    it("get aggregated matching predicate function", () => {
      let target = [{"id": "bar", "baz": "foo"}, {"id": "bar", "baz": "dar"}];

      let squashed = squash(target, obj => obj.id, {aggregatee: "baz", separator: ", "});

      expect(squashed).to.deep.equal([{"id": "bar", "baz": "foo, dar"}]);
    });

    it("don't contain duplicate aggregated values", () => {
      let target = [{"id": "bar", "baz": "foo bar"}, {"id": "bar", "baz": "foo bar"}];

      let squashed = squash(target, "id", {aggregatee: "baz", separator: ", "});

      expect(squashed[0].baz).to.equal("foo bar");
    });
  });

});

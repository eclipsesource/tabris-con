import select from "../src/helpers/select";
import sinon from "sinon";
import chai from "chai";

let expect = chai.expect;

describe("select", () => {

  beforeEach(() => {
    global.device = sinon.stub();
    device.platform = "iOS";
  });

  it("selects current platform", () => {
    let selected = select({iOS: {foo: "bar"}});

    expect(selected).to.deep.equal({foo: "bar"});
  });

  it("doesn't select other platforms", () => {
    let selected = select({iOS: {foo: "bar"}, windows: {baz: "bar"}});

    expect(selected).to.deep.equal({foo: "bar"});
  });

  it("merges configuration with default configuration", () => {
    let selected = select({iOS: {foo: "bar"}, default: {baz: "bak"}});

    expect(selected).to.deep.equal({foo: "bar", baz: "bak"});
  });

  it("platform configuration has precedence over default configuration", () => {
    let selected = select({iOS: {foo: "bar"}, default: {foo: "bak"}});

    expect(selected).to.deep.equal({foo: "bar"});
  });

  it("returns default configuration if platform configuration not defined", () => {
    let selected = select({Android: {foo: "bar"}, default: {foo: "bak"}});

    expect(selected).to.deep.equal({foo: "bak"});
  });

  it("can select non-objects", () => {
    let selected1 = select({iOS: 24});
    let selected2 = select({iOS: [24]});

    expect(selected1).to.deep.equal(24);
    expect(selected2).to.deep.equal([24]);
  });

  it("platform non-objects have precedence over default non-objects", () => {
    let selected = select({iOS: 24, default: 23});

    expect(selected).to.deep.equal(24);
  });

  it("fails to merge with default if default is not an object", () => {
    let selectFn = () => select({iOS: {foo: "bar"}, default: 24});

    expect(selectFn).to.throw(Error);
  });

});

import {select} from "../src/helpers/platform";
import sinon from "sinon";
import chai from "chai";

let expect = chai.expect;

describe("select", () => {

  beforeEach(() => {
    global.device = sinon.stub();
    device.platform = "iOS";
  });

  it("selects member for current platform", function() {
    let selected = select({ios: {foo: 23}});

    expect(selected).to.eql({foo: 23});
  });

  it("does not include other platforms", function() {
    let selected = select({ios: {foo: 23}, windows: {bar: 42}});

    expect(selected).to.eql({foo: 23});
  });

  it("selects default configuration if platform missing", function() {
    let selected = select({android: {foo: 23}, default: {bar: 42}});

    expect(selected).to.eql({bar: 42});
  });

  it("merges selection with 'extend' member (selection takes precedence)", function() {
    let selected = select({ios: {foo: 23}, extend: {foo: 42, bar: 42}});

    expect(selected).to.eql({foo: 23, bar: 42});
  });

  it("can select non-objects", function() {
    let date = new Date();

    expect(select({ios: 24})).to.equal(24);
    expect(select({ios: [24]})).to.eql([24]);
    expect(select({ios: date})).to.eql(date);
  });

  it("fails if extend member is not an object", function() {
    let selectFn = () => select({ios: {foo: "bar"}, extend: 24});

    expect(selectFn).to.throw(Error, "extend can only be used with objects");
  });

  it("fails if extend member is present and selection is not an object", function() {
    let selectFn = () => select({ios: 24, extend: {foo: "bar"}});

    expect(selectFn).to.throw(Error, "extend can only be used with objects");
  });

  it("returns extend when platform not found and extend present", function() {
    let selected = select({android: {foo: 23}, extend: {bar: 42}});

    expect(selected).to.eql({bar: 42});
  });

  it("can select falsy platform values", function() {
    expect(select({ios: 0})).to.eql(0);
    expect(select({ios: false})).to.eql(false);
  });

  it("can select falsy default values", function() {
    expect(select({default: 0})).to.eql(0);
    expect(select({default: false})).to.eql(false);
  });
});

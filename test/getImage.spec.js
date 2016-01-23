var expect = require("chai").expect;
var mockfs = require("mock-fs");
var sizes = require("../resources/sizes");
var getImage = require("../src/getImage");

var mockObject = {};

sizes.SUPPORTED_DEVICE_PIXEL_RATIOS.forEach(function(devicePixelRatio) {
  mockObject[__dirname + "/../../resources/images/foobar@" + devicePixelRatio + "x.png"]  = new Buffer([]);
});

describe("getImage", function() {
  before(function() {
    mockfs(mockObject);
    window = {};
  });
  after(function() {
    mockfs.restore();
  });

  describe("returns scaled image for supported devicePixelRatio", function() {
    sizes.SUPPORTED_DEVICE_PIXEL_RATIOS.forEach(function(devicePixelRatio) {
      it("returns scaled image for devicePixelRatio " + devicePixelRatio, function() {
        window.devicePixelRatio = devicePixelRatio;
        expect(getImage("foobar")).to.deep.equal({
          src: "resources/images/foobar@" + devicePixelRatio + "x.png",
          scale: devicePixelRatio
        });
      });
    });
    afterEach(function() {
      window = {};
    });
  });

  describe("returns scaled image for unsupported devicePixelRatio with closest supported scale", function() {
    it("returns image with scale 3 for devicePixelRatio 4", function() {
      window.devicePixelRatio = 4;
      expect(getImage("foobar")).to.deep.equal({src: "resources/images/foobar@3x.png", scale: 3});
    });
    it("returns image with scale 3 for devicePixelRatio 2.6", function() {
      window.devicePixelRatio = 2.6;
      expect(getImage("foobar")).to.deep.equal({src: "resources/images/foobar@3x.png", scale: 3});
    });
    it("returns image with scale 2 for devicePixelRatio 2.46", function() {
      window.devicePixelRatio = 2.46;
      expect(getImage("foobar")).to.deep.equal({src: "resources/images/foobar@2x.png", scale: 2});
    });
    afterEach(function() {
      window = {};
    });
  });
});

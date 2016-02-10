/*jshint expr: true*/

var expect = require("chai").expect;
var sinon = require("sinon");
var fs = require("fs");
var mockfs = require("mock-fs");
var sizes = require("../resources/sizes");
var getImage = require("../src/getImage");
var _ = require("lodash");

var IMAGES_PATH = "../resources/images";
var PLATFORMS_WITH_ICONSETS = ["iOS", "Android"];

describe("image", function() {

  beforeEach(function() {
    global.window = sinon.stub();
  });

  describe("getImage", function() {

    describe("forDevicePlatform", function() {

      before(function() {
        var mockObject = {};
        sizes.SUPPORTED_DEVICE_PIXEL_RATIOS.forEach(function(devicePixelRatio) {
          PLATFORMS_WITH_ICONSETS.forEach(function(platform) {
            mockObject[getMockedPath(platform, devicePixelRatio)] = new Buffer([]);
          });
        });

        mockfs(mockObject);
      });

      beforeEach(function() {
        global.device = sinon.stub();
      });

      after(function() {
        mockfs.restore();
      });

      it("returns empty string for undefined images", function() {
        var image = getImage.forDevicePlatform(undefined);

        expect(image).to.equal("");
      });

      describe("returns scaled image for supported devicePixelRatio", function() {
        sizes.SUPPORTED_DEVICE_PIXEL_RATIOS.forEach(function(devicePixelRatio) {
          PLATFORMS_WITH_ICONSETS.forEach(function(platform) {
            it("returns scaled image for devicePixelRatio " + devicePixelRatio, function() {
              device.platform = platform;
              window.devicePixelRatio = devicePixelRatio;

              var image = getImage.forDevicePlatform("foobar");

              expect(image).to.deep.equal({
                src: ["resources/images", platform, "foobar@" + devicePixelRatio + "x.png"].join("/"),
                scale: devicePixelRatio
              });
            });
          });
        });
      });

      describe("returns scaled image for unsupported devicePixelRatio with closest supported scale", function() {
        beforeEach(function() {
          device.platform = "Android";
        });

        it("returns image with scale 3 for devicePixelRatio 4", function() {
          window.devicePixelRatio = 4;

          var image = getImage.forDevicePlatform("foobar");

          expect(image).to.deep.equal({src: "resources/images/Android/foobar@3x.png", scale: 3});
        });

        it("returns image with scale 3 for devicePixelRatio 2.6", function() {
          window.devicePixelRatio = 2.6;

          var image = getImage.forDevicePlatform("foobar");

          expect(image).to.deep.equal({src: "resources/images/Android/foobar@3x.png", scale: 3});
        });

        it("returns image with scale 2 for devicePixelRatio 2.46", function() {
          window.devicePixelRatio = 2.46;

          var image = getImage.forDevicePlatform("foobar");

          expect(image).to.deep.equal({src: "resources/images/Android/foobar@2x.png", scale: 2});
        });

        it("returns image with explicit image size", function() {
          window.devicePixelRatio = 3;

          var remoteImage = getImage.forDevicePlatform("http://location", 200, 300);

          expect(remoteImage).to.deep.equal({src: "http://location", width: 200, height: 300});
        });

      });

    });

    describe("common", function() {

      it("returns non-platform specific images", function() {
        window.devicePixelRatio = 2.46;

        var image = getImage.common("foobar");

        expect(image).to.deep.equal({src: "resources/images/foobar@2x.png", scale: 2});
      });

    });

  });

  describe("resource", function() {
    var iOSImageNames = _(fs.readdirSync([__dirname, IMAGES_PATH, "iOS"].join("/")))
      .map(extractFilenames)
      .value();
    var androidImageNames = _(fs.readdirSync([__dirname, IMAGES_PATH, "Android"].join("/")))
      .map(extractFilenames)
      .value();
    var commonImageNames = _(fs.readdirSync([__dirname, IMAGES_PATH].join("/")))
      .map(extractFilenames)
      .filter(function(filename) {return ["iOS", "Android", "UWP"].indexOf(filename) < 0;})
      .value();
    _.uniq(iOSImageNames).forEach(assertVariantsExist("iOS"));
    _.uniq(androidImageNames).forEach(assertVariantsExist("Android"));
    _.uniq(commonImageNames).forEach(assertVariantsExist());
  });

});

function assertVariantsExist(platform) {
  return function(imageName) {
    it(imageName + " has variants for all supported densities for " + (platform || "both platforms"), function() {
      sizes.SUPPORTED_DEVICE_PIXEL_RATIOS.forEach(function(density) {
        var filePath = [__dirname, IMAGES_PATH];
        if (platform) {
          filePath.push(platform);
        }
        filePath.push(imageName + "@" + density + "x.png");
        var fileExists = fs.statSync(filePath.join("/")).isFile();

        expect(fileExists).to.be.true;
      });
    });
  };
}

function extractFilenames(el) {
  return el.match(/[^@]*/)[0];
}

function getMockedPath(platform, devicePixelRatio) {
  return [
    __dirname,
    "../../resources/images",
    platform,
    "foobar@" + devicePixelRatio + "x.png"
  ];
}

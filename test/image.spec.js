/*jshint expr: true*/

var expect = require("chai").expect;
var fakeGlobalForSuite = require("./fakeGlobalForSuite");
var fs = require("fs");
var mockfs = require("mock-fs");
var sizes = require("../resources/sizes");
var getImage = require("../src/getImage");
var _ = require("underscore");

var IMAGES_PATH = "/../resources/images/";

describe("image", function() {

  fakeGlobalForSuite("window");

  describe("getImage", function() {

    before(function() {
      var mockObject = {};
      sizes.SUPPORTED_DEVICE_PIXEL_RATIOS.forEach(function(devicePixelRatio) {
        mockObject[__dirname + "/../../resources/images/foobar@" + devicePixelRatio + "x.png"]  = new Buffer([]);
      });
      mockfs(mockObject);
    });

    after(function() {
      mockfs.restore();
    });

    it("returns empty string for undefined images", function() {
      var image = getImage(undefined);

      expect(image).to.equal("");
    });

    describe("returns scaled image for supported devicePixelRatio", function() {
      sizes.SUPPORTED_DEVICE_PIXEL_RATIOS.forEach(function(devicePixelRatio) {
        it("returns scaled image for devicePixelRatio " + devicePixelRatio, function() {
          window.devicePixelRatio = devicePixelRatio;

          var image = getImage("foobar");

          expect(image).to.deep.equal({
            src: "resources/images/foobar@" + devicePixelRatio + "x.png",
            scale: devicePixelRatio
          });
        });
      });
    });

    describe("returns scaled image for unsupported devicePixelRatio with closest supported scale", function() {
      it("returns image with scale 3 for devicePixelRatio 4", function() {
        window.devicePixelRatio = 4;

        var image = getImage("foobar");

        expect(image).to.deep.equal({src: "resources/images/foobar@3x.png", scale: 3});
      });

      it("returns image with scale 3 for devicePixelRatio 2.6", function() {
        window.devicePixelRatio = 2.6;

        var image = getImage("foobar");

        expect(image).to.deep.equal({src: "resources/images/foobar@3x.png", scale: 3});
      });

      it("returns image with scale 2 for devicePixelRatio 2.46", function() {
        window.devicePixelRatio = 2.46;

        var image = getImage("foobar");

        expect(image).to.deep.equal({src: "resources/images/foobar@2x.png", scale: 2});
      });

      it("returns absolutely sized remote image for density independent image size", function() {
        window.devicePixelRatio = 3;

        var remoteImage = getImage("http://location", 200, 300);

        expect(remoteImage).to.deep.equal({src: "http://location", width: 600, height: 900});
      });

    });

  });

  describe("resource", function() {
    var imageNames = [];
    fs.readdirSync(__dirname + IMAGES_PATH).forEach(function(file) {
      imageNames.push(file.match(/[^@]*/)[0]);
    });
    _.uniq(imageNames).forEach(function(imageName) {
      it(imageName + " has variants for all supported densities", function() {
        assertDensitiesForImage(imageName);
      });
    });
  });

});

function assertDensitiesForImage(imageName) {
  sizes.SUPPORTED_DEVICE_PIXEL_RATIOS.forEach(function(density) {
    var filePath = __dirname + IMAGES_PATH + imageName + "@" + density + "x.png";

    var fileExists = fs.statSync(filePath).isFile();

    expect(fileExists).to.be.true;
  });
}

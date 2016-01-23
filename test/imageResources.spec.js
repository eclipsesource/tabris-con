/*jshint expr: true*/

var expect = require("chai").expect;
var fs = require("fs");
var sizes = require("../resources/sizes");
var _ = require("underscore");

var IMAGES_PATH = "/../resources/images/";

describe("image resource", function() {
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

function assertDensitiesForImage(imageName) {
  sizes.SUPPORTED_DEVICE_PIXEL_RATIOS.forEach(function(density) {
    var filePath = __dirname + IMAGES_PATH + imageName + "@" + density + "x.png";
    expect(fs.statSync(filePath).isFile()).to.be.true;
  });
}

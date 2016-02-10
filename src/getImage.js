var sizes = require("../resources/sizes");
var FALLBACK_PLATFORM = "Android";

module.exports = function(image, width, height) {
  if (!image) {
    return "";
  }
  var closestSupportedRatio = closest(sizes.SUPPORTED_DEVICE_PIXEL_RATIOS, window.devicePixelRatio);
  var imageObject = {src: getImageSource(image, closestSupportedRatio)};
  if (width && height) {
    imageObject.width = width;
    imageObject.height = height;
  } else {
    imageObject.scale = closestSupportedRatio;
  }
  return imageObject;
};

function closest(array, goal) {
  return array.reduce(function(prev, curr) {
    return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
  });
}

function getImageSource(image, closestSupportedRatio) {
  return image.match(/^https?:\/\//) ? image :
    ["resources/images", getDevicePlatform(), image + "@" + closestSupportedRatio + "x.png"].join("/");
}

function getDevicePlatform() {
  var supportedPlatforms = ["Android", "iOS"];
  if (supportedPlatforms.indexOf(device.platform) < 0) {
    return FALLBACK_PLATFORM;
  }
  return device.platform;
}

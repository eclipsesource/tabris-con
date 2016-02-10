var sizes = require("../resources/sizes");
var FALLBACK_PLATFORM = "Android";

module.exports = {
  forDevicePlatform: function(image, width, height) {
    return getImage(image, width, height, device.platform);
  },
  common: function(image, width, height) {
    return getImage(image, width, height);
  }
};

function getImage(image, width, height, platform) {
  if (!image) {
    return "";
  }
  var closestSupportedRatio = closest(sizes.SUPPORTED_DEVICE_PIXEL_RATIOS, window.devicePixelRatio);
  var imageObject = {src: getImageSource(image, closestSupportedRatio, platform)};
  if (width && height) {
    imageObject.width = width;
    imageObject.height = height;
  } else {
    imageObject.scale = closestSupportedRatio;
  }
  return imageObject;
}

function closest(array, goal) {
  return array.reduce(function(prev, curr) {
    return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
  });
}

function getImageSource(image, closestSupportedRatio, platform) {
  var path = ["resources/images"];
  if (platform) {
    path.push(getPathPlatform(platform));
  }
  path.push(image + "@" + closestSupportedRatio + "x.png");
  return image.match(/^https?:\/\//) ? image : path.join("/");
}

function getPathPlatform(platform) {
  var supportedPlatforms = ["Android", "iOS"];
  if (supportedPlatforms.indexOf(platform) < 0) {
    return FALLBACK_PLATFORM;
  }
  return platform;
}

var sizes = require("../resources/sizes");

module.exports = function(image, width, height) {
  if(!image) {
    return "";
  }
  var closestSupportedRatio = closest(sizes.SUPPORTED_DEVICE_PIXEL_RATIOS, window.devicePixelRatio);
  var imageObject = {src: getImageSource(image, closestSupportedRatio)};
  if(width && height) {
    imageObject.width = width;
    imageObject.height = height;
  } else {
    imageObject.scale = closestSupportedRatio;
  }
  return imageObject;
};

function closest(array, goal) {
  return array.reduce(function (prev, curr) {
    return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
  });
}

function getImageSource(image, closestSupportedRatio) {
  return image.match(/^https?:\/\//) ? image :
    "resources/images/" + image + "@" + closestSupportedRatio + "x.png";
}
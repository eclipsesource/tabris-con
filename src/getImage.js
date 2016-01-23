var sizes = require("../resources/sizes");

module.exports = function(imageName) {
  var closestSupportedRatio = closest(sizes.SUPPORTED_DEVICE_PIXEL_RATIOS, window.devicePixelRatio);
  return {
    src: "resources/images/" + imageName + "@" + closestSupportedRatio + "x.png",
    scale: closestSupportedRatio
  };
};

function closest(array, goal) {
  return array.reduce(function (prev, curr) {
    return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
  });
}

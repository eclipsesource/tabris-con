import sizes from "../resources/sizes";
let FALLBACK_PLATFORM = "Android";

export default {
  forDevicePlatform: (image, width, height) => getImage(image, width, height, device.platform),
  common: (image, width, height) => getImage(image, width, height)
};

function getImage(image, width, height, platform) {
  if (!image) {
    return "";
  }
  let closestSupportedRatio = closest(sizes.SUPPORTED_DEVICE_PIXEL_RATIOS, window.devicePixelRatio);
  let imageObject = {src: getImageSource(image, closestSupportedRatio, platform)};
  if (width && height) {
    imageObject.width = width;
    imageObject.height = height;
  } else {
    imageObject.scale = closestSupportedRatio;
  }
  return imageObject;
}

function closest(array, goal) {
  return array.reduce((prev, curr) => Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
}

function getImageSource(image, closestSupportedRatio, platform) {
  let path = ["images"];
  if (platform) {
    path.push(getPathPlatform(platform));
  }
  path.push(image + "@" + closestSupportedRatio + "x.png");
  return image.match(/^https?:\/\//) ? image : path.join("/");
}

function getPathPlatform(platform) {
  let supportedPlatforms = ["Android", "iOS", "UWP"];
  if (supportedPlatforms.indexOf(platform) < 0) {
    return FALLBACK_PLATFORM;
  }
  return platform;
}

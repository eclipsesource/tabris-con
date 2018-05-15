const SUPPORTED_DEVICE_PIXEL_RATIOS = [1, 1.5, 2, 3];

export default function getImage(image, width, height) {
  if (!image) {
    return "";
  }
  let closestSupportedRatio = closest(SUPPORTED_DEVICE_PIXEL_RATIOS, window.devicePixelRatio);
  let imageObject = {src: getImageSource(image, closestSupportedRatio)};
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

function getImageSource(image, closestSupportedRatio) {
  let path = `images/${image}@${closestSupportedRatio}x.png`;
  return image.match(/^https?:\/\//) ? image : path;
}

export function select(config) {
  let selected = getSelected(config);
  if ("extend" in config) {
    if (!isObject(config.extend) || !isObject(selected)) {
      throw new Error("extend can only be used with objects");
    }
    return Object.assign({}, config.extend, selected);
  }
  return selected;
}

function getSelected(config) {
  let platform = device.platform && device.platform.toLowerCase();
  if (platform in config) {
    return config[platform];
  }
  if ("default" in config) {
    return config.default;
  }
  return {};
}

function isObject(value) {
  return value ? Object.getPrototypeOf(value) === Object.prototype : false;
}

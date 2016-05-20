// Selects configuration for the current platform.
export default function(configuration) {
  let platformConfiguration = configuration[device.platform];
  if (!platformConfiguration) {
    return configuration.default;
  }
  if (Object.getPrototypeOf(platformConfiguration) === Object.prototype) {
    if (configuration.default && Object.getPrototypeOf(configuration.default) !== Object.prototype) {
      throw new Error(
        "Default configuration must be an object literal when platform configuration is an object literal."
      );
    }
    return Object.assign({}, configuration.default, platformConfiguration);
  }
  return platformConfiguration;
}

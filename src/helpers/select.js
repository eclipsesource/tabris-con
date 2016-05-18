// Selects configuration for the current platform.
export default function(configuration) {
  let platformConfiguration = configuration[device.platform];
  if (!platformConfiguration) {
    return configuration.default;
  }
  if (typeof platformConfiguration === "object") {
    return Object.assign({}, configuration.default, platformConfiguration);
  }
  return platformConfiguration;
}

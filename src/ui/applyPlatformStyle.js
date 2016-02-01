var platformStyles = require("../../resources/platformStyles");
var FALLBACK_PLATFORM = "Android";

module.exports = function(widget) {
  var widgetIdentifier = widget.get("id") || widget.type;
  var widgetStyles = platformStyles[widgetIdentifier];
  var widgetPlatformStyles = widgetStyles[device.platform] || widgetStyles[FALLBACK_PLATFORM];
  widget.set(widgetPlatformStyles);
};

var platformStyles = require("../resources/platformStyles");
var FALLBACK_PLATFORM = "Android";

module.exports = function(widget) {
  applyPlatformStyle(widget, "#" + widget.get("id"));
  applyPlatformStyle(widget, "." + widget.get("class"));
  applyPlatformStyle(widget, widget.type);
};

function applyPlatformStyle(widget, widgetIdentifier) {
  var widgetStyles = platformStyles[widgetIdentifier];
  if (widgetStyles) {
    var widgetPlatformStyles = widgetStyles[device.platform] || widgetStyles[FALLBACK_PLATFORM];
    if (widgetPlatformStyles) {
      widget.set(widgetPlatformStyles);
    }
  }
}

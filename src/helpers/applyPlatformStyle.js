import platformStyles from "../resources/platformStyles";
let FALLBACK_PLATFORM = "Android";

export default function(widget) {
  applyPlatformStyle(widget, "#" + widget.id);
  applyPlatformStyle(widget, "." + widget.class);
  applyPlatformStyle(widget, widget.constructor.name);
}

function applyPlatformStyle(widget, widgetIdentifier) {
  let widgetStyles = platformStyles[widgetIdentifier];
  if (widgetStyles) {
    let widgetPlatformStyles = widgetStyles[device.platform] || widgetStyles[FALLBACK_PLATFORM];
    if (widgetPlatformStyles) {
      widget.set(widgetPlatformStyles);
    }
  }
}

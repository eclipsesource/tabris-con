import platformStyles from "../resources/platformStyles";
let FALLBACK_PLATFORM = "Android";

export default function(widget) {
  applyPlatformStyle(widget, "#" + widget.get("id"));
  applyPlatformStyle(widget, "." + widget.get("class"));
  applyPlatformStyle(widget, widget.type);
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

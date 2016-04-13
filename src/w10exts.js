if (device.platform === "windows") {
  forEachWidgetType(function(widgetType) {
    addProperties(widgetType, {
      "windows_theme": {
        type: ["choice", ["default", "light", "dark"]],
        default: "default"
      }
    });
  });
  addProperties(tabris._UI, {
    "windows_toolbarTheme": {
      type: ["choice", ["default", "light", "dark"]],
      default: "default"
    }
  });
  addProperties(tabris.Drawer, {
    "windows_displayMode": {
      type: ["choice", ["overlay", "compactOverlay"]],
      default: "overlay"
    },
    "windows_buttonBackground": {
      type: "color",
      default: null
    }
  });
}

function addProperties(widgetType, properties) {
  let normalized = tabris.registerType.normalizePropertiesMap(properties);
  for (let prop in normalized) {
    widgetType._properties[prop] = normalized[prop];
  }
}

function forEachWidgetType(fn) {
  for (let type in tabris) {
    if (tabris[type].prototype &&
        tabris[type].prototype.append === tabris.Widget.prototype.append &&
        tabris[type] !== tabris.Widget) {
      fn(tabris[type]);
    }
  }
}

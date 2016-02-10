if (device.platform === "UWP") {
  forEachWidgetType(function(widgetType) {
    addProperties(widgetType, {
      "uwp_theme": {
        type: ["choice", ["default", "light", "dark"]],
        default: "default"
      }
    });
  });
  addProperties(tabris._UI, {
    "uwp_toolbarTheme": {
      type: ["choice", ["default", "light", "dark"]],
      default: "default"
    }
  });
}

function addProperties(widgetType, properties) {
  var normalized = tabris.registerType.normalizePropertiesMap(properties);
  for (var prop in normalized) {
    widgetType._properties[prop] = normalized[prop];
  }
}

function forEachWidgetType(fn) {
  for (var type in tabris) {
    if (tabris[type].prototype &&
        tabris[type].prototype.append === tabris.Widgets.append &&
        tabris[type] !== tabris.Widgets) {
      fn(tabris[type]);
    }
  }
}

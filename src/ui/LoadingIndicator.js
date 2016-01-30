var create = {
  Android: function() {
    return tabris.create("Composite"); // stub
  },
  iOS: function(options) {
    var composite = tabris.create("Composite", {
      left: 0, top: 0, right: 0, bottom: 0,
      background: options && options.shade ? "white" : "transparent"
    });
    tabris.create("ActivityIndicator", {centerX: 0, centerY: 0}).appendTo(composite);
    return composite;
  }
};

exports.create = function(options) {
  if (["Android", "iOS"].indexOf(device.platform) > -1) {
    return create[device.platform](options);
  }
  return tabris.create("Composite"); // not implemented for this platform
};

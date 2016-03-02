exports.create = function(options) {
  var composite = tabris.create("Composite", {
    left: 0, top: 0, right: 0, bottom: 0,
    id: "loadingIndicator"
  });
  tabris.create("Composite", {
    left: 0, top: 0, right: 0, bottom: 0,
    background: options && options.shade ? "white" : "transparent"
  }).on("tap", function() {}).appendTo(composite);
  tabris.create("ActivityIndicator", {centerX: 0, centerY: 0}).appendTo(composite);
  return composite;
};

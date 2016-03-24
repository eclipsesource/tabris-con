exports.create = function(options) {
  var composite = new tabris.Composite({
    left: 0, top: 0, right: 0, bottom: 0,
    id: "loadingIndicator"
  });
  new tabris.Composite({
    left: 0, top: 0, right: 0, bottom: 0,
    background: options && options.shade ? "white" : "transparent"
  }).on("tap", function() {}).appendTo(composite);
  new tabris.ActivityIndicator({centerX: 0, centerY: 0}).appendTo(composite);
  return composite;
};

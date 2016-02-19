module.exports = function(widget) {
  widget.on("change:progress", function(widget, progress) {
    widget.set("visible", !progress);
    if (progress) {
      if (widget.get("bounds").width) {
        widget.set("indicator", createLoadingIndicator(widget));
      } else {
        widget.on("resize", function() {
          widget.set("indicator", createLoadingIndicator(widget));
        });
      }
    } else {
      var indicator = widget.get("indicator");
      if (indicator && !indicator.isDisposed()) {
        indicator.dispose();
      }
      widget.set("indicator", null);
    }
  });
};

function createLoadingIndicator(widget) {
  return tabris.create("ActivityIndicator", {layoutData: widget.get("bounds")}).appendTo(widget.parent());
}

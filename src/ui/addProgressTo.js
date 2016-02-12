module.exports = function(widget) {
  widget.on("change:progress", function(widget, progress) {
    widget.set("visible", !progress);
    if (progress) {
      var indicator = tabris.create("ActivityIndicator", {layoutData: widget.get("bounds")}).appendTo(widget.parent());
      widget.set("indicator", indicator);
    } else {
      var indicator = widget.get("indicator");
      if (indicator && !indicator.isDisposed()) {
        indicator.dispose();
      }
      widget.set("indicator", null);
    }
  });
};

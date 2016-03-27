import {ActivityIndicator} from "tabris";

export default function(widget) {
  widget.on("change:progress", (widget, progress) => {
    widget.set("visible", !progress);
    if (progress) {
      if (widget.get("bounds").width) {
        widget.set("indicator", createLoadingIndicator(widget));
      } else {
        widget.once("resize", () => widget.set("indicator", createLoadingIndicator(widget)));
      }
    } else {
      let indicator = widget.get("indicator");
      if (indicator && !indicator.isDisposed()) {
        indicator.dispose();
      }
      widget.set("indicator", null);
    }
  });
}

function createLoadingIndicator(widget) {
  return new ActivityIndicator({layoutData: widget.get("bounds")}).appendTo(widget.parent());
}

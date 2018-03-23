import {ActivityIndicator} from "tabris";

// TODO: remove, obsoleted by "Progress"
export default function(widget) {
  widget.showProgress = function(progress) {
    widget.visible = !progress;
    if (progress) {
      if (!widget.indicator || widget.indicator.isDisposed()) {
        widget.indicator = new ActivityIndicator().appendTo(widget.parent());
      }
      if (widget.bounds.width) {
        widget.indicator.layoutData = widget.bounds;
      } else {
        widget.once("resize", () => widget.indicator.layoutData = widget.bounds);
      }
    } else {
      if (widget.indicator) {
        widget.indicator.dispose();
      }
      widget.indicator = null;
    }
  };
}

function createLoadingIndicator(widget) {
  return new ActivityIndicator({layoutData: widget.bounds}).appendTo(widget.parent());
}

import {ActivityIndicator} from "tabris";

export default function(widget) {
  widget.showProgress = function(progress) {
    widget.visible = !progress;
    if (progress) {
      if (widget.bounds.width) {
        widget.indicator = createLoadingIndicator(widget);
      } else {
        widget.once("resize", () => widget.indicator = createLoadingIndicator(widget));
      }
    } else {
      let indicator = widget.indicator;
      if (indicator && !indicator.isDisposed()) {
        indicator.dispose();
      }
      widget.indicator = null;
    }
  };
}

function createLoadingIndicator(widget) {
  return new ActivityIndicator({layoutData: widget.bounds}).appendTo(widget.parent());
}

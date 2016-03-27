import getImage from "../helpers/getImage";
import sizes from "../resources/sizes";
import {Composite, ImageView} from "tabris";

export default class extends Composite {
  constructor() {
    super({
      top: ["prev()", sizes.MARGIN_LARGE], centerX: 0,
      feedback: "0"
    });

    let thumbUp = new ImageView({
      id: "thumbUp",
      left: 0, top: 0, width: sizes.FEEDBACK_THUMB_SIZE,
      highlightOnTouch: true,
      image: getImage.forDevicePlatform("feedback_thumb_up"),
      selection: false
    }).appendTo(this);

    let thumbDown = new ImageView({
      id: "thumbDown",
      left: [thumbUp, sizes.MARGIN_LARGE], top: 0, width: sizes.FEEDBACK_THUMB_SIZE,
      highlightOnTouch: true,
      image: getImage.forDevicePlatform("feedback_thumb_down"),
      selection: false
    }).appendTo(this);

    this._addThumbButtonListeners(thumbUp);
    this._addThumbButtonListeners(thumbDown);
  }

  _addThumbButtonListeners(thumb) {
    thumb
      .on("tap", () => {
        thumb.set("selection", true);
        thumb.trigger("select", thumb);
        this.set("selection", thumb);
      })
      .on("select", deselectSiblings)
      .on("change:selection", (widget, selection) => {
        let buttonId = widget.get("id");
        let selectedPart = selection ? "_selected" : "";
        widget.set("image",
          getImage.forDevicePlatform("feedback_thumb_" + buttonId.toLowerCase().replace("thumb", "") + selectedPart));
        if (selection) {
          this.set("feedback", thumb.get("id") === "thumbUp" ? "+1" : "-1");
        }
      });
  }
}

function deselectSiblings(widget) {
  widget
    .parent()
    .children()
    .filter(child => child.get("id") !== widget.get("id"))
    .first()
    .set("selection", false);
}

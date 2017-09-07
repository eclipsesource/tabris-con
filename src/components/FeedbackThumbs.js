import getImage from "../helpers/getImage";
import sizes from "../resources/sizes";
import {Composite, ImageView} from "tabris";

class Thumb extends ImageView {

  constructor(properties) {
    super(Object.assign({highlightOnTouch: true}, properties));
    this.on("tap", () => {
      this.selection = true;
      this.trigger("select");
      this._deselectSiblings();
    });
  }

  set selection(selection) {
    this._selection = selection;
    let selectedPart = selection ? "_selected" : "";
    this.image =
      getImage.forDevicePlatform("feedback_thumb_" + this.id.toLowerCase().replace("thumb", "") + selectedPart);
  }

  get selection() {
    return this._selection;
  }

  _deselectSiblings() {
    this
      .parent()
      .children()
      .filter(child => child.id !== this.id)
      .first()
      .selection = false;
  }

}

export default class FeedbackThumbs extends Composite {

  constructor() {
    super({
      top: ["prev()", sizes.MARGIN_LARGE], centerX: 0,
      feedback: "0"
    });

    new Thumb({
      id: "thumbUp",
      left: 0, top: 0, width: sizes.FEEDBACK_THUMB_SIZE,
      image: getImage.forDevicePlatform("feedback_thumb_up")
    }).on("select", () => this.feedback = "+1")
      .appendTo(this);

    new Thumb({
      id: "thumbDown",
      left: ["prev()", sizes.MARGIN_LARGE], top: 0, width: sizes.FEEDBACK_THUMB_SIZE,
      image: getImage.forDevicePlatform("feedback_thumb_down")
    }).on("select", () => this.feedback = "-1")
      .appendTo(this);

  }

  set feedback(feedback) {
    this._feedback = feedback;
  }

  get feedback() {
    return this._feedback;
  }

}


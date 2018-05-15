import { Composite, ImageView, ImageViewProperties, CompositeProperties } from "tabris";
import { property } from "tabris-decorators";
import getImage from "../helpers/getImage";

class Thumb extends ImageView {

  public jsxProperties: JSX.ImageViewProperties & { onSelect?: () => void };

  private _selection: boolean = false;

  constructor(properties: ImageViewProperties) {
    super(Object.assign({ highlightOnTouch: true }, properties));
    this.on("tap", () => {
      this.selection = true;
      this.trigger("select");
      this.deselectSiblings();
    });
  }

  set selection(selection: boolean) {
    this._selection = selection;
    let selectedPart = selection ? "_selected" : "";
    this.image = getImage("feedback_thumb_" + this.id.toLowerCase()
      .replace("thumb", "") + selectedPart);
  }

  get selection() {
    return this._selection;
  }

  private deselectSiblings() {
    let sibling = this.parent().children()
      .filter(child => child.id !== this.id).first() as Thumb;
    sibling.selection = false;
  }

}

export default class FeedbackThumbs extends Composite {

  public jsxProperties: JSX.CompositeProperties;

  @property public feedback: string = "0";

  constructor(properties: CompositeProperties) {
    super(properties);
    this.append(
      <Thumb
        id="thumbUp"
        left={0} top={0} width={THUMB_SIZE}
        image={getImage("feedback_thumb_up")}
        onSelect={() => this.feedback = "+1"} />,
      <Thumb
        id="thumbDown"
        left="prev() 16" top={0} width={THUMB_SIZE}
        image={getImage("feedback_thumb_down")}
        onSelect={() => this.feedback = "-1"} />
    );
  }

}

const THUMB_SIZE = 36;

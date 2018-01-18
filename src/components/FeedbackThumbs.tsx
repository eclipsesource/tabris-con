import { Composite, ImageView, ImageViewProperties } from "tabris";
import { property } from "tabris-decorators";
import getImage from "../helpers/getImage";
import sizes from "../resources/sizes";

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
    this.image = getImage.forDevicePlatform("feedback_thumb_" + this.id.toLowerCase()
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

  constructor() {
    super({top: ["prev()", sizes.MARGIN_LARGE], centerX: 0}); // TODO: set layout externally
    this.append(
      <Thumb
        id="thumbUp"
        left={0} top={0} width={sizes.FEEDBACK_THUMB_SIZE}
        image={getImage.forDevicePlatform("feedback_thumb_up")}
        onSelect={() => this.feedback = "+1"} />,
      <Thumb
        id="thumbDown"
        left={["prev()", sizes.MARGIN_LARGE]} top={0} width={sizes.FEEDBACK_THUMB_SIZE}
        image={getImage.forDevicePlatform("feedback_thumb_down")}
        onSelect={() => this.feedback = "-1"} />
    );
  }

}

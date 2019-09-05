import { Composite, ImageView, ImageViewProperties, CompositeProperties } from "tabris";
import { property, ComponentJSX } from "tabris-decorators";
import getImage from "../helpers/getImage";
import colors from "../resources/colors";
import { Feedback } from "../Feedback";

const THUMB_SIZE = 36;

class FeedbackButton extends ImageView {

  public jsxProperties: ComponentJSX<this> & { onSelect?: () => void };

  private _selected: boolean = false;

  constructor(properties: ImageViewProperties) {
    super();
    this.set({highlightOnTouch: true, ...properties});
    this.on("tap", () => {
      this.selected = true;
      this.trigger("select");
      this.deselectSiblings();
    });
  }

  set selected(selected: boolean) {
    this._selected = selected;
    this.tintColor = selected ? colors.TINT_COLOR : null;
  }

  get selected() {
    return this._selected;
  }

  private deselectSiblings() {
    this.parent().children(FeedbackButton)
      .filter(child => child !== this)
      .forEach(sibling => sibling.selected = false);
  }

}

export default class FeedbackSelector extends Composite {

  public jsxProperties: JSX.CompositeProperties;

  @property public feedback: Feedback = Feedback.NEUTRAL;

  constructor(properties: CompositeProperties) {
    super(properties);
    this.append(
      <widgetCollection>
        <FeedbackButton
          left={0} top={0} width={THUMB_SIZE}
          image={getImage("emoticon_sad")}
          onSelect={() => this.feedback = Feedback.NEGATIVE} />
        <FeedbackButton selected
          left="prev() 16" top={0} width={THUMB_SIZE}
          image={getImage("emoticon_neutral")}
          onSelect={() => this.feedback = Feedback.NEUTRAL} />
        <FeedbackButton
          left="prev() 16" top={0} width={THUMB_SIZE}
          image={getImage("emoticon_happy")}
          onSelect={() => this.feedback = Feedback.POSITIVE} />
      </widgetCollection>
    );
  }

}

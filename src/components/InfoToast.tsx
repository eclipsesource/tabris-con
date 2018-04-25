import { Composite, CompositeProperties, ui, EventObject } from "tabris";
import fontToString from "../helpers/fontToString";
import colors from "../resources/colors";
import { bind, component } from "tabris-decorators";

const POP_ANIMATION_DURATION: number = 500;
const POP_HIDE_DELAY: number = 5000;

interface InfoToastProperties {
  messageText: string;
  actionText: string;
}

@component export default class InfoToast extends Composite {

  public static show(properties: InfoToastProperties) {
    return new InfoToast({
      left: 0, bottom: 0, right: 0,
      ...properties
    }).appendTo(ui.contentView);
  }

  public tsProperties: CompositeProperties & InfoToastProperties;
  public jsxProperties: JSX.CompositeProperties & InfoToastProperties & {
    onActionTap?: () => void
  };

  @bind("#label.text") public messageText: string;
  @bind("#actionLabel.text") public actionText: string;

  constructor(properties: CompositeProperties & InfoToastProperties) {
    super();
    this.append(
      <widgetCollection>
        <textView
            id="label"
            left={16} right="#actionLabel 8" centerY={0}
            textColor={colors.LIGHT_PRIMARY_TEXT_COLOR}
            font={fontToString({ size: 14 })}
            markupEnabled={true} />,
        <textView
            id="actionLabel"
            right={16} centerY={0} height={HEIGHT}
            highlightOnTouch={true}
            textColor={colors.ACTION_COLOR}
            visible={!!properties.actionText}
            font={fontToString({ size: 14 })}
            onTap={() => this.triggerActionTap()} />
      </widgetCollection>
    );
    this.set({
      class: "infoToast",
      height: HEIGHT,
      background: colors.INFO_TOAST_BACKGROUND_COLOR,
      ...properties
    });
    if (ui.contentView.find(".infoToast").toArray().every(toast => toast.isDisposed())) {
      this.transform = { translationY: HEIGHT };
      this.animateVisibility(true);
    }
    setTimeout(() => this.animateVisibility(false), POP_HIDE_DELAY);
  }

  private triggerActionTap() {
    this.trigger("actionTap", new EventObject());
    ui.contentView.find(".infoToast").dispose();
  }

  private async animateVisibility(show: boolean) {
    await this.animate({
      transform: { translationY: show ? 0 : HEIGHT }
    }, {
      duration: POP_ANIMATION_DURATION,
      easing: "ease-out"
    });
    if (!show) {
      this.dispose();
    }
  }

}

const HEIGHT = 48;

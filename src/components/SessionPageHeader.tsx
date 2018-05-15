import { Composite, ImageView, ImageViewProperties, CompositeProperties, EventObject } from "tabris";
import { bind, component } from "tabris-decorators";
import fontToString from "../helpers/fontToString";
import getImage from "../helpers/getImage";
import colors from "../resources/colors";
import { select } from "../helpers/platform";

@component export default class SessionPageHeader extends Composite {

  public jsxProperties: JSX.CompositeProperties & {
    onAttendanceButtonTap?: () => void
  };

  @bind("#titleLabel.text") public titleText: string;
  @bind("#summaryLabel.text") public summaryText: string;
  @bind("#attendanceButton.checked") public attending: boolean;
  @bind("#trackIndicator.background") public trackIndicatorColor: string;

  constructor(properties: CompositeProperties) {
    super(Object.assign({
      id: "sessionPageHeader",
      background: select({ android: colors.BACKGROUND_COLOR, default: "white" })
    }, properties));
    this.createUI();
  }

  private createUI() {
    this.append(
      <widgetCollection>
        <composite
            id="navigation"
            left={0} top={0} right={0} height={select({ android: ICON_SIZE, default: 0 })}>
          <imageView
              left={0} top={0} width={ICON_SIZE}
              image={getImage("back_arrow")}
              highlightOnTouch={true}
              height={select({ android: ICON_SIZE, default: 0 })}
              onTap={() => this.trigger("backButtonTap")} />
          <AttendanceButton
              id="attendanceButton"
              right={0} top={0} width={ICON_SIZE}
              height={select({ android: ICON_SIZE, default: 0 })}
              onSelect={() => this.trigger("attendanceButtonTap", new EventObject())} />
        </composite>
        <textView
            id="titleLabel"
            right={16}
            left={select({ ios: 32, default: 72 })}
            top={select({ android: "#navigation 8", default: "#navigation 16" })}
            font={fontToString({ weight: "bold", size: 18 })}
            textColor={select({
              android: colors.ANDROID_ACTION_AREA_FOREGROUND_COLOR,
              default: colors.DARK_PRIMARY_TEXT_COLOR
            })} />
        <textView
            id="summaryLabel"
            right={16} top="prev()"
            left={select({ ios: 32, default: 72 })}
            bottom={16}
            font={ fontToString({size: select({android: 16, default: 14})}) }
            textColor={select({
              android: colors.ANDROID_ACTION_AREA_FOREGROUND_COLOR,
              default: colors.DARK_SECONDARY_TEXT_COLOR
            })} />
        <composite
            id="trackIndicator"
            {...TRACK_INDICATOR_LAYOUT} />
      </widgetCollection>
    );
  }

}

class AttendanceButton extends ImageView {

  public jsxProperties: JSX.ImageViewProperties & {
    onSelect?: () => void
  };

  private _checked: boolean = false;

  constructor(properties: ImageViewProperties) {
    super(Object.assign({
      image: getImage("plus"),
      highlightOnTouch: true
    }, properties));
    this.on("tap", () => this.trigger("select"));
  }

  set checked(checked: boolean) {
    this._checked = checked;
    this.image = checked ? getImage("check") : getImage("plus");
  }

  get checked() {
    return this._checked;
  }

}

const ICON_SIZE = select({
  default: 56,
  windows: 48
});

const TRACK_INDICATOR_LAYOUT = select({
  ios: {left: 16, top: 8, bottom: 8, width: 2},
  windows: {top: 20, width: 18, height: 18},
  default: {top: "#navigation 10", width: 18, height: 18},
  extend: {left: 27}
});

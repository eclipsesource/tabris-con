import { Composite, ImageView, ImageViewProperties, CompositeProperties, EventObject } from "tabris";
import { bind } from "tabris-decorators";
import SessionPageHeaderTrackIndicator from "./SessionPageHeaderTrackIndicator";
import fontToString from "../helpers/fontToString";
import getImage from "../helpers/getImage";
import colors from "../resources/colors";
import { select } from "../helpers/platform";

export default class SessionPageHeader extends Composite {

  public jsxProperties: JSX.CompositeProperties & {
    onAttendanceButtonTap?: () => void
  };

  @bind("#sessionPageTitleTextView.text") public titleText: string;
  @bind("#summaryTextView.text") public summaryText: string;
  @bind("#attendanceButton.checked") public attending: boolean;
  @bind("#trackIndicator.color") public trackIndicatorColor: string;

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
            id="sessionPageNavigationControls"
            left={0} top={0} right={0} height={select({ android: ICON_SIZE, default: 0 })}>
          <imageView
              left={0} top={0} width={ICON_SIZE}
              image={getImage.forDevicePlatform("back_arrow")}
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
            id="sessionPageTitleTextView"
            right={16}
            left={select({ ios: 32, default: 72 })}
            top={select({ android: "#sessionPageNavigationControls 8", default: "#sessionPageNavigationControls 16" })}
            font={fontToString({ weight: "bold", size: 18 })}
            textColor={select({
              android: colors.ANDROID_ACTION_AREA_FOREGROUND_COLOR,
              default: colors.DARK_PRIMARY_TEXT_COLOR
            })} />
        <textView
            id="summaryTextView"
            right={16} top="prev()"
            left={select({ ios: 32, default: 72 })}
            bottom={16}
            font={ fontToString({size: select({android: 16, default: 14})}) }
            textColor={select({
              android: colors.ANDROID_ACTION_AREA_FOREGROUND_COLOR,
              default: colors.DARK_SECONDARY_TEXT_COLOR
            })} />
        <SessionPageHeaderTrackIndicator
            id="trackIndicator"
            left={select({ ios: 16, default: 0 })}
            right={select({ ios: null, default: "#sessionPageTitleTextView" })}
            bottom={select({ ios: 8, default: null })}
            width={select({ ios: 2, default: null })}
            top={select({ android: "#sessionPageNavigationControls 10", ios: 8, windows: 20 })} />
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
      image: getImage.common("plus"),
      highlightOnTouch: true
    }, properties));
    this.on("tap", () => this.trigger("select"));
  }

  set checked(checked: boolean) {
    this._checked = checked;
    this.image = checked ? getImage.common("check") : getImage.common("plus");
  }

  get checked() {
    return this._checked;
  }

}

const ICON_SIZE = select({
  default: 56,
  windows: 48
});

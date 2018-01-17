import { Composite, ImageView, ImageViewProperties, CompositeProperties, EventObject } from "tabris";
import { bind } from "tabris-decorators";
import SessionPageHeaderTrackIndicator from "./SessionPageHeaderTrackIndicator";
import fontToString from "../helpers/fontToString";
import getImage from "../helpers/getImage";
import colors from "../resources/colors";
import sizes from "../resources/sizes";
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
            left={0} top={0} right={0} height={select({ android: sizes.SESSION_HEADER_ICON, default: 0 })}>
          <imageView
              left={0} top={0} width={sizes.SESSION_HEADER_ICON}
              image={getImage.forDevicePlatform("back_arrow")}
              highlightOnTouch={true}
              height={select({
                android: sizes.SESSION_HEADER_ICON,
                default: 0
              })}
              onTap={() => this.trigger("backButtonTap")} />
          <AttendanceButton
              id="attendanceButton"
              right={0} top={0} width={sizes.SESSION_HEADER_ICON}
              height={select({
                android: sizes.SESSION_HEADER_ICON,
                default: 0
              })}
              onSelect={() => this.trigger("attendanceButtonTap", new EventObject())} />
        </composite>
        <textView
            id="sessionPageTitleTextView"
            right={sizes.MARGIN_LARGE}
            left={select({
              ios: sizes.MARGIN_XLARGE,
              default: sizes.LEFT_CONTENT_MARGIN
            })}
            top={select({
              android: ["#sessionPageNavigationControls", sizes.MARGIN],
              default: ["#sessionPageNavigationControls", sizes.MARGIN_LARGE]
            })}
            font={fontToString({ weight: "bold", size: sizes.FONT_XLARGE })}
            textColor={select({
              android: colors.ANDROID_ACTION_AREA_FOREGROUND_COLOR,
              default: colors.DARK_PRIMARY_TEXT_COLOR
            })} />
        <textView
            id="summaryTextView"
            right={sizes.MARGIN_LARGE} top="prev()"
            left={select({
              ios: sizes.MARGIN_XLARGE,
              default: sizes.LEFT_CONTENT_MARGIN
            })}
            bottom={sizes.MARGIN_LARGE}
            font={select({
              android: fontToString({ size: sizes.FONT_LARGE }),
              default: fontToString({ size: sizes.FONT_MEDIUM })
            })}
            textColor={select({
              android: colors.ANDROID_ACTION_AREA_FOREGROUND_COLOR,
              default: colors.DARK_SECONDARY_TEXT_COLOR
            })} />
        <SessionPageHeaderTrackIndicator
            id="trackIndicator"
            left={select({ ios: sizes.MARGIN_LARGE, default: 0 })}
            right={select({ ios: null, default: "#sessionPageTitleTextView" })}
            bottom={select({ ios: sizes.MARGIN, default: null })}
            width={select({ ios: 2, default: null })}
            top={sizes.SESSION_PAGE_TRACK_INDICATOR_TOP} />
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

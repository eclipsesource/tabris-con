import { Composite, TextView, ImageView, CompositeProperties } from "tabris";
import { getById, component } from "tabris-decorators";
import fontToString from "../helpers/fontToString";
import getImage from "../helpers/getImage";
import colors from "../resources/colors";
import config from "../configs/config";
import { select } from "../helpers/platform";
import { If } from "../helpers/jsxHelper";

@component export default class SessionItem extends Composite {

  public jsxProperties: JSX.CompositeProperties;

  @getById private trackIndicator: Composite;
  @getById private titleLabel: TextView;
  @getById private summaryLabel: TextView;

  private _data: any = null;

  constructor(properties: CompositeProperties) {
    super();
    this.createUI();
    this.set(properties);
  }

  set data(data: any) {
    this._data = data;
    if (config.SESSIONS_HAVE_IMAGES) {
      let image = getImage(data.image, ICON_WIDTH, ICON_HEIGHT);
      (this._find("#imageView").first() as ImageView).image = image;
    }
    this.trackIndicator.background = config.TRACK_COLOR && config.TRACK_COLOR[data.categoryName] || "initial";
    this.titleLabel.text = data.title;
    this.summaryLabel.text = data.summary;
  }

  get data() {
    return this._data;
  }

  private createUI() {
    this.append(
      <widgetCollection>
        <If isTruthy={config.SESSIONS_HAVE_IMAGES}>
          <imageView
            id="imageView"
            centerY={0} width={ICON_WIDTH} height={ICON_HEIGHT}
            scaleMode="fill" />
        </If>
        <composite
            id="trackIndicator"
            left="prev()" top={8} bottom={8} width={2}
            background="red" />,
        <composite
            left="prev() 14" right={4}
            top={config.SESSIONS_HAVE_IMAGES ? 8 : null}
            centerY={config.SESSIONS_HAVE_IMAGES ? null : 0} >
          <textView
              id="titleLabel"
              left={0} top={0} right={0}
              maxLines={1}
              font={select({
                ios: fontToString({ weight: "normal", size: 16 }),
                default: fontToString({ weight: "bold", size: 14 })
              })}
              textColor={select({
                ios: colors.DARK_PRIMARY_TEXT_COLOR,
                default: colors.ACCENTED_TEXT_COLOR
              })} />
          <textView
              id="summaryLabel"
              left={0} top="#titleLabel 2" right={0}
              font={fontToString({ size: 14 })}
              maxLines={2}
              markupEnabled={true}
              lineSpacing={1.2}
              textColor={colors.DARK_SECONDARY_TEXT_COLOR} />
        </composite>
      </widgetCollection>
    );
  }

}

const ICON_HEIGHT = 84;
const ICON_WIDTH = 112;

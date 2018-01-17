import { Composite, TextView, ImageView, CompositeProperties } from "tabris";
import { getById } from "tabris-decorators";
import fontToString from "../helpers/fontToString";
import getImage from "../helpers/getImage";
import colors from "../resources/colors";
import config from "../configs/config";
import sizes from "../resources/sizes";
import { select } from "../helpers/platform";

export default class SessionItem extends Composite {

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
      let image = getImage.forDevicePlatform(
        data.image,
        sizes.SESSION_CELL_IMAGE_WIDTH,
        sizes.SESSION_CELL_IMAGE_HEIGHT
      );
      (this.find("#imageView").first() as ImageView).image = image;
    }
    this.trackIndicator.background = config.TRACK_COLOR && config.TRACK_COLOR[data.categoryName] || "initial";
    this.titleLabel.text = data.title;
    this.summaryLabel.text = data.summary;
  }

  get data() {
    return this._data;
  }

  private createUI() {
    if (config.SESSIONS_HAVE_IMAGES) {
      this.append(
        <imageView
          id="imageView"
          centerY={0} width={sizes.SESSION_CELL_IMAGE_WIDTH} height={sizes.SESSION_CELL_IMAGE_HEIGHT}
          scaleMode="fill" />
      );
    }
    this.append(
      <composite
          id="trackIndicator"
          left="prev()" top={sizes.MARGIN} bottom={sizes.MARGIN} width={2}
          background="red" />,
      <composite
          left={["prev()", sizes.MARGIN_LARGE * 0.8]} right={sizes.MARGIN_SMALL}
          top={config.SESSIONS_HAVE_IMAGES ? sizes.MARGIN : null}
          centerY={config.SESSIONS_HAVE_IMAGES ? null : 0} >
        <textView
            id="titleLabel"
            left={0} top={0} right={0}
            maxLines={1}
            font={select({
              ios: fontToString({ weight: "normal", size: sizes.FONT_LARGE }),
              default: fontToString({ weight: "bold", size: sizes.FONT_MEDIUM })
            })}
            textColor={select({
              ios: colors.DARK_PRIMARY_TEXT_COLOR,
              default: colors.ACCENTED_TEXT_COLOR
            })} />
        <textView
            id="summaryLabel"
            left={0} top={["#titleLabel", sizes.MARGIN_XSMALL]} right={0}
            font={fontToString({ size: sizes.FONT_MEDIUM })}
            maxLines={2}
            markupEnabled={true}
            lineSpacing={sizes.LINE_SPACING}
            textColor={colors.DARK_SECONDARY_TEXT_COLOR} />
      </composite>
    );
  }

}

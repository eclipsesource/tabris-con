import fontToString from "../helpers/fontToString";
import colors from "../resources/colors";
import sizes from "../resources/sizes";
import config from "../configs/config";
import getImage from "../helpers/getImage";
import {select} from "../helpers/platform";
import _ from "lodash";
import {Composite, TextView, ImageView} from "tabris";

export default class SessionItem extends Composite {

  constructor(configuration) {
    super(configuration);
    if (config.SESSIONS_HAVE_IMAGES) {
      this._imageView = createSessionImage().appendTo(this);
    }
    this._trackIndicator = new Composite({
      left: "prev()", top: sizes.MARGIN, bottom: sizes.MARGIN, width: 2, background: "red"
    }).appendTo(this);
    let textContainer = new Composite(_.extend({
        left: ["prev()", sizes.MARGIN_LARGE * 0.8], right: sizes.MARGIN_SMALL
      }, config.SESSIONS_HAVE_IMAGES ? {top: sizes.MARGIN} : {centerY: 0})
    ).appendTo(this);
    this._titleTextView = createSessionTitleTextView().appendTo(textContainer);
    this._summaryLabel = new TextView({
      left: 0, top: [this._titleTextView, sizes.MARGIN_XSMALL], right: 0,
      font: fontToString({size: sizes.FONT_MEDIUM}),
      maxLines: 2,
      markupEnabled: true,
      lineSpacing: sizes.LINE_SPACING,
      textColor: colors.DARK_SECONDARY_TEXT_COLOR
    }).appendTo(textContainer);
  }

  set data(data) {
    this._data = data;
    if (config.SESSIONS_HAVE_IMAGES) {
      let image = getImage.forDevicePlatform(
        data.image,
        sizes.SESSION_CELL_IMAGE_WIDTH,
        sizes.SESSION_CELL_IMAGE_HEIGHT
      );
      this._imageView.image = image;
    }
    this._trackIndicator.background = config.TRACK_COLOR && config.TRACK_COLOR[data.categoryName] || "initial";
    this._titleTextView.text = data.title;
    this._summaryLabel.text = data.summary;
  }

  get data() {
    return this._data;
  }

}

function createSessionImage() {
  return new ImageView({
    id: "imageView",
    centerY: 0, width: sizes.SESSION_CELL_IMAGE_WIDTH, height: sizes.SESSION_CELL_IMAGE_HEIGHT,
    scaleMode: "fill"
  });
}

function createSessionTitleTextView() {
  return new TextView({
    left: 0, top: 0, right: 0,
    maxLines: 1,
    font: select({
      ios: fontToString({weight: "normal", size: sizes.FONT_LARGE}),
      default: fontToString({weight: "bold", size: sizes.FONT_MEDIUM})
    }),
    textColor: select({
      ios: colors.DARK_PRIMARY_TEXT_COLOR,
      default: colors.ACCENTED_TEXT_COLOR
    })
  });
}

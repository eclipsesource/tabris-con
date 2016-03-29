import fontToString from "../helpers/fontToString";
import colors from "../resources/colors";
import sizes from "../resources/sizes";
import config from "../config";
import getImage from "../helpers/getImage";
import applyPlatformStyle from "../helpers/applyPlatformStyle";
import _ from "lodash";
import {Composite, TextView, ImageView} from "tabris";

export default class extends Composite {
  constructor(configuration) {
    super(Object.assign({}, configuration, {class: "sessionItem"}));
    applyPlatformStyle(this);
    if (config.SESSIONS_HAVE_IMAGES) {
      var imageView = createSessionImage().appendTo(this);
    }
    let trackIndicator = new Composite({
      left: 0, top: sizes.MARGIN, bottom: sizes.MARGIN, width: 2, background: "red"
    }).appendTo(this);
    let textContainer = new Composite(_.extend({
        left: ["prev()", sizes.MARGIN_LARGE * 0.8], right: sizes.MARGIN_SMALL
      }, config.SESSIONS_HAVE_IMAGES ? {top: sizes.MARGIN} : {centerY: 0})
    ).appendTo(this);
    applyPlatformStyle(textContainer);
    let titleTextView = createSessionTitleTextView().appendTo(textContainer);
    applyPlatformStyle(titleTextView);
    let summaryTextView = new TextView({
      left: 0, top: [titleTextView, sizes.MARGIN_XSMALL], right: 0,
      font: fontToString({size: sizes.FONT_MEDIUM}),
      maxLines: 2,
      textColor: colors.DARK_SECONDARY_TEXT_COLOR
    }).appendTo(textContainer);
    this.on("change:data", (widget, data) => {
      if (config.SESSIONS_HAVE_IMAGES) {
        let image = getImage.forDevicePlatform(
          data.image,
          sizes.SESSION_CELL_IMAGE_WIDTH,
          sizes.SESSION_CELL_IMAGE_HEIGHT
        );
        imageView.set("image", image);
      }
      trackIndicator.set("background", config.TRACK_COLOR && config.TRACK_COLOR[data.categoryName] || "initial");
      titleTextView.set("text", data.title);
      summaryTextView.set("text", data.summary);
    });
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
    id: "sessionTitleTextView",
    left: 0, top: 0, right: 0,
    maxLines: 1
  });
}

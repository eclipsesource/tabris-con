import addProgressTo from "../helpers/addProgressTo";
import fontToString from "../helpers/fontToString";
import sizes from "../resources/sizes";
import applyPlatformStyle from "../helpers/applyPlatformStyle";
import colors from "../resources/colors";
import {Composite, ImageView, TextView} from "tabris";

export default class extends Composite {
  constructor(text, image) {
    super({
      left: 0, top: "prev()", right: 0, height: sizes.DRAWER_LIST_ITEM_HEIGHT,
      highlightOnTouch: true,
      progress: false
    });

    addProgressTo(this);

    let drawerIconImageView = new ImageView({
      class: "drawerIconImageView", image: image,
      centerY: 0
    }).appendTo(this);

    applyPlatformStyle(drawerIconImageView);

    let drawerTitleTextView = new TextView({
      class: "drawerTitleTextView",
      text: text,
      font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM}),
      left: sizes.LEFT_CONTENT_MARGIN, centerY: 0,
      textColor: colors.DRAWER_TEXT_COLOR
    }).appendTo(this);

    applyPlatformStyle(drawerTitleTextView);
  }
}

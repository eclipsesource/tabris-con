import addProgressTo from "../helpers/addProgressTo";
import fontToString from "../helpers/fontToString";
import sizes from "../resources/sizes";
import colors from "../resources/colors";
import {select} from "../helpers/platform";
import {Composite, ImageView, TextView} from "tabris";

export default class extends Composite {
  constructor(text, image) {
    super({
      left: 0, top: "prev()", right: 0, height: sizes.DRAWER_LIST_ITEM_HEIGHT,
      highlightOnTouch: true,
      progress: false
    });
    addProgressTo(this);
    let icon = new ImageView({
      class: "icon",
      left: select({default: sizes.MARGIN_LARGE, windows: 1.5 * sizes.MARGIN}),
      centerY: 0,
      image
    }).appendTo(this);
    new TextView({
      class: "title",
      left: select({
        windows: [icon, sizes.MARGIN_XLARGE],
        default: sizes.LEFT_CONTENT_MARGIN
      }),
      centerY: 0,
      text,
      font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM}),
      textColor: select({windows: "white", default: colors.DRAWER_TEXT_COLOR})
    }).appendTo(this);
  }
}

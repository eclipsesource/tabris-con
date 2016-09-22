import sizes from "../../resources/sizes";
import {TextView} from "tabris";
import moment from "moment-timezone";
import texts from "../../resources/texts";
import {select} from "../../helpers/platform";
import colors from "../../resources/colors";

export function get() {
  return {
    itemHeight: sizes.LAST_UPDATED_ITEM_CELL_HEIGHT,
    initializeCell: cell => {
      let time = new TextView({
        left: sizes.MARGIN_LARGE,
        centerY: select({android: 0, default: null}),
        bottom: select({android: null, default: 0}),
        font: "italic 12px sans-serif",
        textColor: colors.DARK_SECONDARY_TEXT_COLOR
      }).appendTo(cell);
      cell.set("background", select({
        android: colors.LIGHT_BACKGROUND_COLOR,
        default: "initial"
      }));
      cell.on("change:item", (widget, item) => {
        time.set("text", `${texts.LAST_UPDATED} ${moment(item.value).format("ll LT")}`);
      });
    },
    select: () => {}
  };
}

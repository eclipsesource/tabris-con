import {Composite, TextView} from "tabris";
import moment from "moment-timezone";
import texts from "../../resources/texts";
import {select} from "../../helpers/platform";
import colors from "../../resources/colors";

export function get() {
  return {
    cellHeight: select({ android: 48, default: 32 }),
    createCell: () => {
      let cell = new Composite({left: 0, top: 0, right: 0, bottom: 0});
      cell.time = new TextView({
        left: 16, centerY: select({android: 0, default: null}), bottom: select({android: null, default: 0}),
        font: "italic 12px sans-serif",
        textColor: colors.DARK_SECONDARY_TEXT_COLOR
      }).appendTo(cell);
      cell.background = select({
        android: colors.LIGHT_BACKGROUND_COLOR,
        default: "initial"
      });
      return cell;
    },
    updateCell: (cell, item) => cell.time.text = `${texts.LAST_UPDATED} ${moment(item.value).format("ll LT")}`,
    select: () => {}
  };
}

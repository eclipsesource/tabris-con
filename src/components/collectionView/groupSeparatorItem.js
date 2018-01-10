import sizes from "../../resources/sizes";
import colors from "../../resources/colors";
import {select} from "../../helpers/platform";
import {Composite} from "tabris";

export function get() {
  return {
    cellHeight: sizes.CELL_TYPE_SEPARATOR_HEIGHT,
    createCell: () => {
      let cell = new Composite({left: 0, top: 0, right: 0, bottom: 0});
      new Composite({
        left: 0, top: 0, right: 0, bottom: 0,
        background: select({ios: colors.LINE_SEPARATOR_COLOR, default: colors.LIGHT_BACKGROUND_COLOR})
      }).appendTo(cell);
      return cell;
    },
    select: () => {}
  };
}

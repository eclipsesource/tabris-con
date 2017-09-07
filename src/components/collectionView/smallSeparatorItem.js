import {Composite} from "tabris";
import sizes from "../../resources/sizes";
import colors from "../../resources/colors";

export function get() {
  return {
    cellHeight: sizes.CELL_TYPE_SMALL_SEPARATOR_HEIGHT,
    createCell: () => new Composite({
      left: 0, top: 0, right: 0, bottom: 0,
      background: colors.LIGHT_BACKGROUND_COLOR
    }),
    select: () => {}
  };
}

import sizes from "../../resources/sizes";
import colors from "../../resources/colors";

export function get() {
  return {
    itemHeight: sizes.CELL_TYPE_SMALL_SEPARATOR_HEIGHT,
    initializeCell: cell => cell.set("background", colors.LIGHT_BACKGROUND_COLOR),
    select: () => {}
  };
}

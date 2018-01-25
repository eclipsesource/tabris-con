import {Composite} from "tabris";
import colors from "../../resources/colors";

export function get() {
  return {
    cellHeight: 1,
    createCell: () => new Composite({
      left: 0, top: 0, right: 0, bottom: 0,
      background: colors.LIGHT_BACKGROUND_COLOR
    }),
    select: () => {}
  };
}

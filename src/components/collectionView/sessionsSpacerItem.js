import {Composite} from "tabris";
import sizes from "../../resources/sizes";

export function get() {
  return {
    cellHeight: sizes.CELL_TYPE_SESSIONS_SPACER_HEIGHT,
    createCell: () => new Composite({
      left: 0, top: 0, right: 0, bottom: 0,
      background: "white"
    }),
    select: () => {}
  };
}

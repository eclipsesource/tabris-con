import sizes from "../../resources/sizes";
import applyPlatformStyle from "../../helpers/applyPlatformStyle";
import {Composite} from "tabris";

export function get() {
  return {
    itemHeight: sizes.CELL_TYPE_SEPARATOR_HEIGHT,
    initializeCell: cell => {
      let separator = new Composite({
        class: "groupSeparator",
        left: 0, top: 0, right: 0, bottom: 0
      }).appendTo(cell);
      applyPlatformStyle(separator);
    },
    select: () => {
    }
  };
}

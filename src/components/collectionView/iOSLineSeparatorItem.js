import sizes from "../../resources/sizes";
import colors from "../../resources/colors";
import applyPlatformStyle from "../../helpers/applyPlatformStyle";
import {Composite} from "tabris";

export function get() {
  return {
    itemHeight: sizes.CELL_TYPE_SMALL_SEPARATOR_HEIGHT,
    initializeCell: cell => {
      let separator = new Composite({
        class: "iOSLineSeparator",
        left: sizes.MARGIN_XLARGE, top: 0, right: 0, bottom: 0,
        background: colors.LINE_SEPARATOR_COLOR
      }).appendTo(cell);
      applyPlatformStyle(separator);
    },
    select: () => {
    }
  };
}

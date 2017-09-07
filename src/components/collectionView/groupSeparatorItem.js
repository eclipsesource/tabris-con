import sizes from "../../resources/sizes";
import applyPlatformStyle from "../../helpers/applyPlatformStyle";
import {Composite} from "tabris";

export function get() {
  return {
    cellHeight: sizes.CELL_TYPE_SEPARATOR_HEIGHT,
    createCell: () => {
      let cell = new Composite({left: 0, top: 0, right: 0, bottom: 0});
      let separator = new Composite({
        class: "groupSeparator",
        left: 0, top: 0, right: 0, bottom: 0
      }).appendTo(cell);
      applyPlatformStyle(separator);
      return cell;
    },
    select: () => {}
  };
}

import colors from "../../resources/colors";
import {select} from "../../helpers/platform";
import {Composite} from "tabris";

export function get() {
  return {
    cellHeight: 1,
    createCell: () => {
      let cell = new Composite({left: 0, top: 0, right: 0, bottom: 0});
      new Composite({
        left: 32, top: 0, right: 0, bottom: 0,
        background: colors.LINE_SEPARATOR_COLOR,
        visible: select({ios: true, default: false})
      }).appendTo(cell);
      return cell;
    },
    select: () => {}
  };
}

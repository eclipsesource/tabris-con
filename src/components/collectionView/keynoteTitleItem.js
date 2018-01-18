import {Composite} from "tabris";
import sizes from "../../resources/sizes";
import colors from "../../resources/colors";
import SessionTitle from "../SessionTitle";

export function get() {
  return {
    cellHeight: sizes.SESSION_CATEGORY_TITLE_CELL_HEIGHT,
    createCell: () => {
      let cell = new Composite({left: 0, top: 0, right: 0, bottom: 0});
      cell.title = new SessionTitle({
        left: 0, top: 0, right: 0, height: sizes.SESSION_CATEGORY_TITLE_CELL_HEIGHT,
        background: "white", textColor: colors.KEYNOTE_TITLE_COLOR
      }).appendTo(cell);
      return cell;
    },
    updateCell: (cell, item) => cell.title.text = item.title,
    select: () => {}
  };
}

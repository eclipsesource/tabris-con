import {Composite} from "tabris";
import colors from "../../resources/colors";
import SessionTitle from "../SessionTitle";

export function get() {
  return {
    cellHeight: 48,
    createCell: () => {
      let cell = new Composite({left: 0, top: 0, right: 0, bottom: 0});
      cell.title = new SessionTitle({
        left: 0, top: 0, right: 0, bottom: 0,
        background: "white", textColor: colors.KEYNOTE_TITLE_COLOR
      }).appendTo(cell);
      return cell;
    },
    updateCell: (cell, item) => cell.title.text = item.title,
    select: () => {}
  };
}

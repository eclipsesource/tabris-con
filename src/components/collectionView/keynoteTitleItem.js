import sizes from "../../resources/sizes";
import colors from "../../resources/colors";
import SessionTitle from "../SessionTitle";

export function get() {
  return {
    itemHeight: sizes.SESSION_CATEGORY_TITLE_CELL_HEIGHT,
    initializeCell: cell => {
      let title = new SessionTitle({background: "white", textColor: colors.KEYNOTE_TITLE_COLOR}).appendTo(cell);
      cell.on("change:item", (cell, item) => title.set("text", item.title));
    },
    select: () => {}
  };
}

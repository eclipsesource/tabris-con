import sizes from "../../resources/sizes";

export function get() {
  return {
    itemHeight: sizes.CELL_TYPE_PREVIEW_CATEGORIES_SPACER_HEIGHT,
    initializeCell: cell => cell.set("background", "white"),
    select: () => {}
  };
}

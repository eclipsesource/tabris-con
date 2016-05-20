import sizes from "../../resources/sizes";

export function get() {
  return {
    itemHeight: sizes.CELL_TYPE_SESSIONS_SPACER_HEIGHT,
    initializeCell: cell => cell.set("background", "white"),
    select: () => {}
  };
}

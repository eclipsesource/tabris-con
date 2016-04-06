import sizes from "../../resources/sizes";
import SessionItem from "../SessionItem";
import * as sessionItem from "./sessionItem";

export function get({viewDataProvider, feedbackService}) {
  return {
    itemHeight: getCellHeight(),
    initializeCell: cell => {
      let session = new SessionItem({height: getCellHeight()}).appendTo(cell);
      cell.on("change:item", (cell, item) => session.set("data", item));
    },
    select: sessionItem.get({viewDataProvider, feedbackService}).select
  };
}

function getCellHeight() {
  return sizes.PREVIEW_SESSION_CELL_HEIGHT;
}

import sizes from "../../resources/sizes";
import SessionPage from "../../pages/SessionPage";
import SessionItem from "../SessionItem";

export function get({viewDataProvider, loginService, feedbackService}) {
  return {
    itemHeight: getCellHeight(),
    initializeCell: cell => {
      let session = new SessionItem({height: getCellHeight()}).appendTo(cell);
      cell.on("change:item", (cell, item) => session.set("data", item));
    },
    select: (widget, item) => {
      let sessionPage = new SessionPage(viewDataProvider, loginService, feedbackService).open();
      viewDataProvider["get" + (item.keynote ? "Keynote" : "Session")](item.id)
        .then(session => sessionPage.set("data", session));
    }
  };
}

function getCellHeight() {
  return sizes.SESSION_CELL_HEIGHT[device.platform];
}

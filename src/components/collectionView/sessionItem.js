import sizes from "../../resources/sizes";
import * as SessionPageFactory from "../../pages/SessionPageFactory";
import SessionItem from "../SessionItem";

export function get(viewDataProvider) {
  return {
    itemHeight: getCellHeight(),
    initializeCell: cell => {
      let session = new SessionItem({height: getCellHeight()}).appendTo(cell);
      cell.on("change:item", (cell, item) => session.set("data", item));
    },
    select: (widget, item) => {
      let sessionPage = SessionPageFactory.create(viewDataProvider).open();
      viewDataProvider.getSession(item.id)
        .then(session => sessionPage.set("data", session));
    }
  };
}

function getCellHeight() {
  return sizes.SESSION_CELL_HEIGHT[device.platform];
}

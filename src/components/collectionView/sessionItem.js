import {Composite} from "tabris";
import sizes from "../../resources/sizes";
import SessionPage from "../../pages/SessionPage";
import SessionItem from "../SessionItem";
import {pageNavigation} from "../../pages/navigation";

export function get({viewDataProvider, loginService, feedbackService}) {
  return {
    cellHeight: getCellHeight(),
    createCell: () => {
      let cell = new Composite({
        left: 0, top: 0, right: 0, bottom: 0,
        highlightOnTouch: true
      });
      cell.session = new SessionItem({
        left: sizes.MARGIN_LARGE, right: sizes.MARGIN_LARGE, top: 0, height: getCellHeight()
      }).appendTo(cell);
      return cell;
    },
    updateCell: (cell, item) => cell.session.data = item,
    select: (item) => {
      let sessionPage = new SessionPage(viewDataProvider, loginService, feedbackService).appendTo(pageNavigation);
      viewDataProvider["get" + (item.keynote ? "Keynote" : "Session")](item.id)
        .then(session => sessionPage.data = session)
        .catch(e => console.error(e));
    }
  };
}

function getCellHeight() {
  return sizes.SESSION_CELL_HEIGHT;
}

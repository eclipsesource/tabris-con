import {Composite} from "tabris";
import config from "../../configs/config";
import {select} from "../../helpers/platform";
import SessionPage from "../../pages/SessionPage";
import SessionItem from "../SessionItem";
import {pageNavigation} from "../../pages/navigation";

export function get({viewDataProvider, loginService, feedbackService}) {
  return {
    cellHeight: config.SESSIONS_HAVE_IMAGES ? 98 : select({ios: 56, default: 72}),
    createCell: () => {
      let cell = new Composite({
        left: 0, top: 0, right: 0, bottom: 0,
        highlightOnTouch: true
      });
      cell.session = new SessionItem({ left: 16, right: 16, top: 0, bottom: 0 }).appendTo(cell);
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

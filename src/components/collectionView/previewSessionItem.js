import {Composite} from "tabris";
import sizes from "../../resources/sizes";
import SessionItem from "../SessionItem";
import * as sessionItem from "./sessionItem";

export function get({viewDataProvider, loginService, feedbackService}) {
  return {
    cellHeight: getCellHeight(),
    createCell: () => {
      let cell = new Composite({left: 0, top: 0, right: 0, bottom: 0});
      cell.session = new SessionItem({
        left: sizes.MARGIN_LARGE, right: sizes.MARGIN_LARGE, top: 0, height: getCellHeight()
      }).appendTo(cell);
      return cell;
    },
    updateCell: sessionItem.get({viewDataProvider, loginService, feedbackService}).updateCell,
    select: sessionItem.get({viewDataProvider, loginService, feedbackService}).select
  };
}

function getCellHeight() {
  return sizes.PREVIEW_SESSION_CELL_HEIGHT;
}

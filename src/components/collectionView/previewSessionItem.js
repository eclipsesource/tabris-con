import {Composite} from "tabris";
import config from "../../configs/config";
import SessionItem from "../SessionItem";
import * as sessionItem from "./sessionItem";

export function get() {
  return {
    cellHeight: config.SESSIONS_HAVE_IMAGES ? 98 : 72,
    createCell: () => {
      let cell = new Composite({left: 0, top: 0, right: 0, bottom: 0});
      cell.session = new SessionItem({
        left: 16, right: 16, top: 0, bottom: 0
      }).appendTo(cell);
      return cell;
    },
    updateCell: sessionItem.get().updateCell,
    select: sessionItem.get().select
  };
}

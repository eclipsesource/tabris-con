import {Composite} from "tabris";
import {select} from '../../helpers/platform';

export function get() {
  return {
    cellHeight: select({ android: 8, ios: 0 }),
    createCell: () => new Composite({
      left: 0, top: 0, right: 0, bottom: 0,
      background: "white"
    }),
    select: () => {}
  };
}

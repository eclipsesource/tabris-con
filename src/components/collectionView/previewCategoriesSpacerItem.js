import {Composite} from "tabris";

export function get() {
  return {
    cellHeight: 8,
    createCell: () => new Composite({
      left: 0, top: 0, right: 0, bottom: 0,
      background: "white"
    }),
    select: () => {}
  };
}

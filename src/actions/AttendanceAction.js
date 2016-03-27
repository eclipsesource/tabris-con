import getImage from "../helpers/getImage";
import {Action} from "tabris";

export default class extends Action {
  constructor() {
    super({
      id: "attendanceAction",
      image: getImage.common("plus"),
      placementPriority: "high"
    });
    this.on("change:attending", (widget, attending) => {
      this.set("image", attending ? getImage.common("check") : getImage.common("plus"));
    });
  }
}

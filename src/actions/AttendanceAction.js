import getImage from "../helpers/getImage";
import {Action} from "tabris";
import texts from "../resources/texts";

export default class extends Action {
  constructor() {
    super({
      id: "attendanceAction",
      image: getImage.common("plus"),
      title: texts.ATTENDANCE_ACTION_ADD_TITLE,
      placementPriority: "high"
    });
    this.on("change:attending", (widget, attending) => {
      this.set("image", attending ? getImage.common("check") : getImage.common("plus"));
      this.set("title", attending ? texts.ATTENDANCE_ACTION_REMOVE_TITLE : texts.ATTENDANCE_ACTION_ADD_TITLE);
    });
  }
}

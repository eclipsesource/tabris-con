import getImage from "../helpers/getImage";
import {Action} from "tabris";
import texts from "../resources/texts";

export default class AttendanceAction extends Action {
  constructor() {
    super({
      id: "attendanceAction",
      image: getImage("plus"),
      title: texts.ATTENDANCE_ACTION_ADD_TITLE,
      placementPriority: "high"
    });
  }

  set attending(attending) {
    this._attending = attending;
    this.image = attending ? getImage("check") : getImage("plus");
    this.title = attending ? texts.ATTENDANCE_ACTION_REMOVE_TITLE : texts.ATTENDANCE_ACTION_ADD_TITLE;
  }

  get attending() {
    return this._attending;
  }

}

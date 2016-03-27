import Button from "./TabrisConButton";
import addProgressTo from "../helpers/addProgressTo";

export default class extends Button {
  constructor(...args) {
    super(...args);
    addProgressTo(this);
  }
}

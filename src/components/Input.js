import applyPlatformStyle from "../helpers/applyPlatformStyle";
import {TextInput} from "tabris";

export default class extends TextInput {
  constructor(configuration) {
    super(Object.assign({}, configuration, {class: "input"}));
    applyPlatformStyle(this);
    applyPlatformStyle(this);
  }
}

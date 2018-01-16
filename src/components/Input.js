import {TextInput} from "tabris";
import colors from "../resources/colors";
import {select} from "../helpers/platform";

export default class Input extends TextInput {
  constructor(configuration) {
    super(Object.assign({}, configuration, {
      background: select({ios: "initial", default: colors.BACKGROUND_COLOR})
    }));
  }
}

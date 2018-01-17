import { TextInput, TextInputProperties } from "tabris";
import colors from "../resources/colors";
import { select } from "../helpers/platform";

export default class Input extends TextInput {

  public jsxProperties: JSX.TextInputProperties;

  constructor(properties: TextInputProperties) {
    super({
      background: select({ios: "initial", default: colors.BACKGROUND_COLOR}),
      ...properties
    });
  }
}

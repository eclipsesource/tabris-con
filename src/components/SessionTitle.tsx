import { Composite, CompositeProperties } from "tabris";
import { bind } from "tabris-decorators";
import fontToString from "../helpers/fontToString";
import sizes from "../resources/sizes";

export default class SessionTitle extends Composite {

  public jsxProperties: JSX.CompositeProperties;

  @bind("#titleTextView.text") public text: string;
  @bind("#titleTextView.textColor") public textColor: string;

  constructor(properties: CompositeProperties) {
    super();
    this.append(
      <textView
        id="titleTextView"
        left={sizes.MARGIN_LARGE} centerY={0} right={sizes.MARGIN_LARGE}
        maxLines={1}
        font={fontToString({ weight: "bold", size: sizes.FONT_XLARGE })} />
    );
    this.set(properties);
  }

}

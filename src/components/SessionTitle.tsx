import { Composite, CompositeProperties } from "tabris";
import { bind, component } from "tabris-decorators";
import fontToString from "../helpers/fontToString";

@component export default class SessionTitle extends Composite {

  public jsxProperties: JSX.CompositeProperties;

  @bind("#titleTextView.text") public text: string;
  @bind("#titleTextView.textColor") public textColor: string;

  constructor(properties: CompositeProperties) {
    super();
    this.append(
      <textView
        id="titleTextView"
        left={16} centerY={0} right={16}
        maxLines={1}
        font={fontToString({ weight: "bold", size: 18 })} />
    );
    this.set(properties);
  }

}

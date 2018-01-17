import { Composite } from "tabris";

interface OptionArgs {
  shade: boolean;
}

export default class LoadingIndicator extends Composite {

  public jsxProperties: OptionArgs;

  constructor(options?: OptionArgs) {
    super({
      left: 0, top: 0, right: 0, bottom: 0,
      id: "loadingIndicator"
    });
    this.append(
      <widgetCollection>
        <composite
            left={0} top={0} right={0} bottom={0}
            background={options && options.shade ? "white" : "transparent"}
            onTap={() => { /*empty handler*/ }} />
        <activityIndicator
            centerX={0} centerY={0} />
      </widgetCollection>
    );
  }

}

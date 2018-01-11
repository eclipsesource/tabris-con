import colors from "../resources/colors";
import { Composite, CompositeProperties, Page, app, Font } from "tabris";
import { pageNavigation } from "../pages/navigation";
import { bind } from "tabris-decorators";
import property from "tabris-decorators/dist/property";

interface LinkProperties {
  text?: string;
  font?: Font;
  alignment?: string;
  url?: string;
  page?: typeof Page;
}

export default class Link extends Composite {

  public jsxProperties: JSX.CompositeProperties & LinkProperties;

  @bind("#label.text") public text: string;
  @bind("#label.font") public font: string;
  @bind("#label.alignment") public alignment: string;
  @property public url: string;
  @property public page: typeof Page;

  constructor(properties: CompositeProperties & LinkProperties) {
    super();
    this.append(
      <textView
          id="label"
          left={0} top={0} right={0} bottom={0}
          textColor={colors.LINK_COLOR} />
    );
    this.set(properties);
    this.on("tap", () => {
      if (this.url) {
        app.launch(this.url);
      } else if (this.page) {
        new (this.page)().appendTo(pageNavigation);
      }
    });
  }

}

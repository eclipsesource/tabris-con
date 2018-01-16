import { Tab } from "tabris";
import LoadingIndicator from "../components/LoadingIndicator";
import getImage from "../helpers/getImage";
import texts from "../resources/texts";

export default class Map extends Tab {

  public jsxProperties: JSX.TabProperties;

  constructor() {
    super({
      id: "map",
      title: texts.MAP_PAGE_TITLE,
      image: getImage.forDevicePlatform("map"),
      selectedImage: getImage.forDevicePlatform("map_selected")
    });
    // TODO: map is not shown on Android without this workaround
    this.once("appear", () => this.createUI());
  }

  private createUI() {
    this.append(
      <webView
        left={0} top={0} right={0} bottom={0}
        visible={false}
        url="html/map.html"
        onLoad={({ target }) => {
          target.siblings("#loadingIndicator").dispose();
          target.visible = true;
        }}
      />,
      new LoadingIndicator()
    );
  }

}

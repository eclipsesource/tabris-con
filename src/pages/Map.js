import getImage from "../helpers/getImage";
import LoadingIndicator from "../components/LoadingIndicator";
import {WebView, Tab} from "tabris";
import texts from "../resources/texts";

export default class Map extends Tab {
  constructor() {
    super({
      id: "map",
      title: texts.MAP_PAGE_TITLE,
      image: getImage.forDevicePlatform("map"),
      selectedImage: getImage.forDevicePlatform("map_selected")
    });
    // TODO: map is not shown on Android without this workaround
    this.once("appear", () => this._createUI());
  }

  _createUI() {
    this.append(
      new WebView({
        left: 0, top: 0, right: 0, bottom: 0,
        visible: false,
        url: "html/map.html"
      }).on("load", ({target}) => {
        target.siblings("#loadingIndicator").dispose();
        target.visible = true;
      }),
      new LoadingIndicator()
    );
  }

}

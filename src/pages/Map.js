import getImage from "../helpers/getImage";
import Navigatable from "./Navigatable";
import LoadingIndicator from "../components/LoadingIndicator";
import {WebView} from "tabris";
import texts from "../resources/texts";

export default class extends Navigatable {
  constructor({viewDataProvider}) {
    super({
      configuration: {
        id: "map",
        title: texts.MAP_PAGE_TITLE,
        image: getImage.forDevicePlatform("map_selected"), // TODO: selected image initially shown as part of workaround for tabris-ios#841
        left: 0, top: 0, right: 0, bottom: 0
      },
      viewDataProvider
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
      }).on("load", target => {
        target.siblings("#loadingIndicator").dispose();
        target.set("visible", true);
      }),
      new LoadingIndicator()
    );
  }

}

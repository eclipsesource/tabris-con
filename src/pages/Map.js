import getImage from "../helpers/getImage";
import colors from "../resources/colors";
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
    new LoadingIndicator().appendTo(this);
    this.once("appear", () => createWebViewMapContainer(this).on("load", showWebView));
  }
}

function showWebView(webView) {
  webView.set("visible", true);
  webView.parent().set("background", colors.MAP_BACKGROUND_COLOR);
  webView.parent().find("#loadingIndicator").dispose();
}

function createWebViewMapContainer(map) {
  return new WebView({
    left: 0, top: 0, right: 0, bottom: 0,
    visible: false,
    background: "#cdcbcc",
    url: "html/map.html"
  }).appendTo(map);
}

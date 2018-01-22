import { Tab, ActivityIndicator, WebView } from "tabris";
import getImage from "../helpers/getImage";
import texts from "../resources/texts";
import { getById } from "tabris-decorators";

export default class Map extends Tab {

  public jsxProperties: JSX.TabProperties;
  @getById private activityIndicator: ActivityIndicator;
  @getById private mapView: WebView;

  constructor() {
    super({
      id: "map",
      title: texts.MAP_PAGE_TITLE,
      image: getImage.forDevicePlatform("map"),
      selectedImage: getImage.forDevicePlatform("map_selected")
    });
    this.append(
      <widgetCollection>
        <webView
            id="mapView"
            left={0} top={0} right={0} bottom={0}
            visible={false}
            url="html/map.html"
            onLoad={() => this.showMap()} />
        <activityIndicator
            id="activityIndicator"
            centerX={0} centerY={0}/>
      </widgetCollection>
    );
  }

  private showMap() {
    this.activityIndicator.dispose();
    this.mapView.visible = true;
  }

}

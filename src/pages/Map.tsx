import { Tab } from "tabris";
import getImage from "../helpers/getImage";
import texts from "../resources/texts";

export default class Map extends Tab {

  public jsxProperties: JSX.TabProperties;

  constructor() {
    super({
      id: "map",
      title: texts.MAP_PAGE_TITLE,
      image: getImage("map"),
      selectedImage: getImage("map_selected")
    });
    this.append(
      <widgetCollection>
        <imageView
            left={0} top={0} right={0} bottom={0}
            image="images/floorplan.png"
            zoomEnabled={true} />
      </widgetCollection>
    );
  }

}

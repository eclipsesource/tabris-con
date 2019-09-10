import {create} from "tabris-decorators";
import config from "../configs/config";
import colors from "../resources/colors";
import Schedule from "./Schedule";
import Tracks from "./Tracks";
import Map from "./Map";
import Conference from "./Conference";
import About from "./About";
import {TabFolder, Page} from "tabris";

const TABS = [Schedule, Tracks, Map, config.CONFERENCE_PAGE && Conference, About].filter(x => !!x);

export default class MainPage extends Page {

  constructor() {
    super({id: "mainPage"});
    let tabFolder = new TabFolder({
      id: "navigation",
      left: 0, top: 0, right: 0, bottom: 0,
      background: "white",
      textColor: colors.ACCENTED_TEXT_COLOR,
      elevation: 8,
      tabBarLocation: "bottom"
    }).appendTo(this);
    tabFolder.on("selectionChanged", ({value: selection}) => this.title = selection.title);
    TABS.forEach(Tab => create(Tab).appendTo(tabFolder));
    this.selection = this.children("#tracks").first();
    this.title = tabFolder.selection.title;
  }

}

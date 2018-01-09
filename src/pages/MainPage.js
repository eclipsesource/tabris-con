import config from "../configs/config";
import Schedule from "./Schedule";
import Tracks from "./Tracks";
import Map from "./Map";
import Conference from "./Conference";
import About from "./About";
import {TabFolder, Page} from "tabris";
import colors from "../resources/colors";

const TABS = [Schedule, Tracks, Map, config.CONFERENCE_PAGE && Conference, About].filter(x => !!x);

export default class MainPage extends Page {

  constructor({viewDataProvider, loginService, feedbackService}) {
    super({id: "mainPage", topLevel: true});
    let tabFolder = new TabFolder({
      id: "navigation",
      left: 0, top: 0, right: 0, bottom: 0,
      textColor: colors.TINT_COLOR,
      tabBarLocation: "bottom"
    }).appendTo(this);
    tabFolder.on("change:selection", (tabFolder, selection) => {
      selection.trigger("appear");
      this.set("title", selection.get("title"));
    });
    TABS.forEach(Tab => new Tab({viewDataProvider, loginService, feedbackService}).appendTo(tabFolder));
    this.set("selection", this.children("#tracks").first());
    this.on("appear", () => this._triggerAppearOnSelectedTab());
    this.set("title", tabFolder.get("selection").get("title"));
  }

  _triggerAppearOnSelectedTab() {
    tabris.ui.find("#navigation")
      .first()
      .children()
      .filter(tab => tab.parent().get("selection") === tab)
      .forEach(tab => tab.trigger("appear"));
  }

}

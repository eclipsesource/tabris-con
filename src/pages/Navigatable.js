import _ from "lodash";
import getImage from "../helpers/getImage";
import colors from "../resources/colors";
import {Composite, Tab, Page} from "tabris";

export default class extends Composite {
  constructor({configuration, viewDataProvider}) {
    super(_.extend({
      class: "navigatable",
      left: 0, top: 0, right: 0, bottom: 0,
      active: true
    }, configuration));
    this._viewDataProvider = viewDataProvider;
    this.updateImage();
    this.on("change:active", (widget, active) => {
      this.updateImage();
      this.trigger(active ? "appear" : "disappear", this);
    });
    this.once("appear", () => {
      if (!this.get("data")) {
        this.initializeItems();
      }
    });
  }

  getViewDataProvider() {
    return this._viewDataProvider;
  }

  initializeItems() {
    return Promise.resolve();
  }

  updateImage() {
    this.set("image", getImageletiant(this, this.get("active")));
  }

  asTab() {
    let tab = new Tab({
      title: this.get("title"),
      id: this.get("id") + "Tab",
      textColor: colors.TINT_COLOR,
      navigatable: this,
      image: this.get("image"),
      left: 0, top: 0, right: 0, bottom: 0
    }).on("change:data",(widget, data) => this.set("data", data));
    this.appendTo(tab);
    return this;
  }

  asPage() {
    let page = new Page({
      topLevel: true,
      title: this.get("title"),
      navigatable: this,
      id: this.get("id") + "Page"
    }).on("change:data", (widget, data) => this.set("data", data))
      .on("appear", () => this.activate());
    this.appendTo(page);
    return this;
  }

  open() {
    let parent = this.parent();
    if (parent instanceof tabris.Tab) {
      parent.parent().set("selection", parent);
      tabris.ui.find("#mainPage").first().open();
    } else if (parent instanceof tabris.Page) {
      parent.open();
    }
    return this;
  }

  activate() {
    tabris.ui
      .find(".navigatable")
      .forEach(navigatableWidget => {
        if (navigatableWidget.get("active")) {
          navigatableWidget.set("active", false);
        }
      });
    this.set("active", true);
  }
}

function getImageletiant(navigatable, active) {
  let imageName = navigatable.get("id");
  return getImage.forDevicePlatform(active ? imageName + "_selected" : imageName);
}

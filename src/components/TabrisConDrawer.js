import sizes from "../resources/sizes";
import AndroidDrawerUserArea from "./AndroidDrawerUserArea";
import applyPlatformStyle from "../helpers/applyPlatformStyle";
import DrawerPageListItem from "./DrawerPageListItem";
import DrawerLoginListItem from "./DrawerLoginListItem";
import {Drawer, Composite} from "tabris";
import config from "../configs/config";

export default class extends Drawer {
  constructor(loginService) {
    super({
      id: "navigationDrawer",
      win_theme: config.WINDOWS_DRAWER_THEME,
      win_buttonBackground: config.COLOR_SCHEME.WINDOWS_DRAWER_BUTTON_BACKGROUND
    });

    this._loginService = loginService;
    this._nativeSet("win_buttonTheme", config.WINDOWS_DRAWER_BUTTON_THEME);

    if (device.platform === "windows") {
      tabris.device.on("change:orientation", this._updateDisplayMode, this);
      this._updateDisplayMode();
    }

    let drawerContainer = new tabris[device.platform === "windows" ? "Composite" : "ScrollView"]({
      left: 0, top: 0, right: 0, bottom: 0
    }).appendTo(this);

    if (device.platform === "Android") {
      new AndroidDrawerUserArea(this._loginService)
        .appendTo(drawerContainer);
    }

    let drawerList = this._createDrawerList().appendTo(drawerContainer);

    tabris.ui.on("change:activePage", () => {
      drawerList.updateSelection();
      this.close();
    });

    let logoutHandler = () => {
      this.find("#androidDrawerUserArea").set("loggedIn", false);
      this.find("#drawerLoginListItem").set("loggedIn", false);
    };

    let loginHandler = () => {
      this.find("#androidDrawerUserArea").set("loggedIn", true);
      this.find("#drawerLoginListItem").set("loggedIn", true);
    };

    loginService
      .on("logoutSuccess", logoutHandler)
      .on("loginSuccess", loginHandler);

    this.on("dispose", () => {
      loginService
        .off("logoutSuccess", logoutHandler)
        .off("loginSuccess", loginHandler);
    });
  }

  _createSecondaryPageItems() {
    let pageItems = new Composite({
      id: "drawerSecondaryPageItems",
      left: 0, right: 0
    });
    applyPlatformStyle(pageItems);
    createSeparator().appendTo(pageItems);
    if (config.CONFERENCE_PAGE) {
      new DrawerPageListItem("conferencePage").appendTo(pageItems);
    }
    new DrawerPageListItem("aboutPage").appendTo(pageItems);
    if (config.SUPPORTS_FEEDBACK && device.platform !== "iOS") {
      if (device.platform === "Android") {
        createSeparator().appendTo(pageItems);
      }
      new DrawerLoginListItem({
        id: "drawerLoginListItem",
        loginService: this._loginService
      }).appendTo(pageItems);
    }
    return pageItems;
  }

  _createDrawerList() {
    let drawerList = new Composite({id: "drawerList", left: 0, right: 0, bottom: 0});
    drawerList.updateSelection = () => {
      drawerList.find()
        .filter(child => child instanceof DrawerPageListItem || child instanceof DrawerLoginListItem)
        .forEach(pageItem => pageItem.updateSelection());
    };
    applyPlatformStyle(drawerList);
    this._createPrimaryPageItems().appendTo(drawerList);
    this._createSecondaryPageItems().appendTo(drawerList);
    return drawerList;
  }

  _createPrimaryPageItems() {
    let pageItems = new Composite({left: 0, top: 0, right: 0});
    new DrawerPageListItem("schedulePage").appendTo(pageItems);
    new DrawerPageListItem("tracksPage").appendTo(pageItems);
    new DrawerPageListItem("mapPage").appendTo(pageItems);
    return pageItems;
  }

  _updateDisplayMode(device, orientation = tabris.device.get("orientation")) {
    this.set("win_displayMode", orientation.startsWith("portrait") ? "overlay" : "compactOverlay");
  }

}

function createSeparator() {
  let container = new Composite({
    left: 0,
    top: "prev()",
    right: 0,
    height: sizes.DRAWER_SEPARATOR_HEIGHT
  });
  new Composite({
    left: 0, right: 0, centerY: 0, height: 1,
    id: "separator",
    background: "#e8e8e8"
  }).appendTo(container);
  return container;
}

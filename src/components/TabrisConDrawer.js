import sizes from "../resources/sizes";
import AndroidDrawerUserArea from "./AndroidDrawerUserArea";
import getImage from "../helpers/getImage";
import applyPlatformStyle from "../helpers/applyPlatformStyle";
import DrawerListItem from "./DrawerListItem";
import DrawerPageListItem from "./DrawerPageListItem";
import DrawerAccountListItem from "./DrawerAccountListItem";
import {Drawer, Composite} from "tabris";
import config from "../configs/config";

export default class extends Drawer {
  constructor(loginService) {
    super({
      accountMode: false,
      win_displayMode: "compactOverlay",
      win_theme: "dark",
      win_buttonBackground: "rgb(103,86,186)"
    });

    this._loginService = loginService;

    let drawerContainer = new tabris[device.platform === "windows" ? "Composite" : "ScrollView"]({
      left: 0, top: 0, right: 0, bottom: 0
    }).appendTo(this);

    if (device.platform === "Android") {
      new AndroidDrawerUserArea(this._loginService)
        .on("loggedInTap", () => this.set("accountMode", !this.get("accountMode")))
        .appendTo(drawerContainer);
    }

    let drawerList = this._createDrawerList().appendTo(drawerContainer);
    let accountList = this._createAccountList().appendTo(drawerContainer);

    tabris.ui.on("change:activePage", () => {
      drawerList.updateSelection();
      this.close();
    });

    this.on("change:accountMode", (widget, value) => {
      accountList.set("visible", value);
      drawerList.set("visible", !value);
      drawerContainer.children("#androidDrawerUserArea")
        .find("#menuArrowImageView").set("transform", value ? {rotation: Math.PI} : null);
    });

    this.on("logoutSuccess", () => {
      drawerContainer.children("#androidDrawerUserArea").set("loggedIn", false);
      this.set("accountMode", false);
    });
  }

  _createSecondaryPageItems() {
    let pageItems = new Composite({
      id: "drawerSecondaryPageItems",
      left: 0, right: 0
    });
    applyPlatformStyle(pageItems);
    createSeparator().appendTo(pageItems);
    if (config.SUPPORTS_FEEDBACK && device.platform === "windows") {
      new DrawerAccountListItem(this._loginService).appendTo(pageItems);
    }
    new DrawerPageListItem("aboutPage").appendTo(pageItems);
    return pageItems;
  }

  _createDrawerList() {
    let drawerList = new Composite({id: "drawerList", left: 0, right: 0, bottom: 0});
    drawerList.updateSelection = () => {
      drawerList.find()
        .filter(child => child.get("page") instanceof tabris.Page && child.get("page").get("topLevel"))
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

  _createAccountList() {
    let accountList = new Composite({
      left: 0, top: ["#androidDrawerUserArea", 8], right: 0,
      visible: false
    });
    new DrawerListItem("Logout", getImage.forDevicePlatform("logout"))
      .on("tap", widget => {
        widget.set("progress", true);
        this._loginService.logout().then(() => widget.set("progress", false));
      })
      .appendTo(accountList);
    return accountList;
  }

}

function createSeparator() {
  let container = new Composite({
    left: 0,
    top: "prev()",
    right: 0,
    height: sizes.DRAWER_SEPARATOR_HEIGHT[device.platform]
  });
  new Composite({
    left: 0, right: 0, centerY: 0, height: 1,
    id: "separator",
    background: "#e8e8e8"
  }).appendTo(container);
  return container;
}

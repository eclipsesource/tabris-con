import fontToString from "../helpers/fontToString";
import sizes from "../resources/sizes";
import texts from "../resources/texts";
import colors from "../resources/colors";
import getImage from "../helpers/getImage";
import {select} from "../helpers/platform";
import LoginPage from "../pages/LoginPage";
import {Composite, TextView, device, ui} from "tabris";
import DrawerListItem from "./DrawerListItem";

const ACCOUNT_ICON = getImage.forDevicePlatform("account");

export default class extends DrawerListItem {
  constructor(id, loginService) {
    super(texts.LOGIN_PAGE_TITLE, ACCOUNT_ICON);
    this._createLogoutView().appendTo(this);

    this.on("tap", () => {
      if (this.get("loggedIn")) {
        this.set("progress", true);
        loginService.logout().then(() => {
          this.set("progress", false);
          this.set("loggedIn", false);
        });
      } else {
        if (!ui.find("#loginPage").length) {
          let loginPage = new LoginPage(loginService).open();
          loginPage.on("loginSuccess", () => this.set("loggedIn", true));
        }
      }
    });

    this.on("change:loggedIn", (widget, loggedIn) => {
      this.find(".email").set({text: loginService.getUserData().mail});
      this.find(".logoutView").set("visible", loggedIn && device.get("platform") === "windows");
      this.find(".title").set({
        visible: select({windows: !loggedIn, default: true}),
        text: loggedIn ? texts.LOGOUT_BUTTON : texts.LOGIN_BUTTON
      });
    })
    .set("loggedIn", loginService.isLoggedIn());
  }

  updateSelection() {
    let active = tabris.ui.get("activePage").get("id") === "loginPage";
    this.find(".icon").set({
      icon: ACCOUNT_ICON,
      tintColor: select({
        windows: colors.WINDOWS_DRAWER_ICON_TINT,
        default: active ? colors.ANDROID_DRAWER_ICON_SELECTED_TINT : colors.ANDROID_DRAWER_ICON_TINT
      })
    });
    this.set("background", active ? colors.DRAWER_LIST_ITEM_BACKGROUND[device.get("platform")] : "transparent");
  }

  _createLogoutView() {
    let content = new Composite({
      class: "logoutView",
      visible: "false",
      left: [".icon", sizes.MARGIN_XLARGE], top: 0, right: 0, bottom: 0
    });
    new TextView({
      class: "email",
      font: fontToString({weight: "bold", size: sizes.FONT_SMALL}),
      textColor: "white",
      left: 0, top: sizes.MARGIN_SMALL
    }).appendTo(content);
    new TextView({
      font: fontToString({weight: "bold", size: sizes.FONT_MEDIUM}),
      textColor: "white",
      text: texts.LOGOUT_BUTTON,
      left: 0, bottom: sizes.MARGIN_SMALL
    }).appendTo(content);
    return content;
  }
}
